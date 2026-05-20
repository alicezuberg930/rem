package server.rem.interceptors;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import server.rem.entities.BusinessUser;
import server.rem.entities.User;
import server.rem.entities.Role;
import server.rem.entities.Permission;
import server.rem.repositories.BusinessUserRepository;
import server.rem.utils.Constants;
import server.rem.utils.exceptions.UnauthorizedException;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * This filter runs after JWT authentication and before authorization.
 * It extracts the businessId from the request header
 * Checks if the user has access to that business
 * Caches the role to avoid repeated database lookups
 * Updates the security context with the business-specific role/authorities
 */
@Component
@RequiredArgsConstructor
public class BusinessContextFilter extends OncePerRequestFilter {
    // structure: userId -> (businessId -> permissions)
    private static final ConcurrentHashMap<String, Map<String, Set<Permission>>> permissionMap = new ConcurrentHashMap<>();
    private final BusinessUserRepository businessUserRepository;

    private String extractBusinessId(HttpServletRequest request) {
        String businessHeader = request.getHeader(Constants.businessIdCookieKey);
        if (businessHeader != null) return businessHeader;

        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            return Arrays.stream(cookies)
                    .filter(c -> c.getName().equals(Constants.businessIdCookieKey))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);
        }
        return null;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            // Only run if user is already authenticated
            if (authentication != null && authentication.isAuthenticated()) {
                Boolean isUser = authentication.getPrincipal() instanceof User;
                String userId = isUser ? ((User) authentication.getPrincipal()).getId() : null;
                // Extract businessId from request header
                String businessId = extractBusinessId(request);
System.out.println(businessId);

                if (userId != null && businessId != null && !businessId.isEmpty()) {
                    // Check cache first to avoid database queries on every request
                    Set<Permission> cachedPermissions = permissionMap
                            .getOrDefault(userId, new ConcurrentHashMap<>())
                            .get(businessId);

                    if (cachedPermissions != null) {
                        // Use cached permissions
                        setBusinessContextInRequest(request, businessId, cachedPermissions, userId);
                    } else {
                        // If permissions are not cached then query from database
                        BusinessUser businessUser = businessUserRepository
                                .findByUserIdAndBusinessId(userId, businessId)
                                .orElseThrow(() -> new UnauthorizedException("User does not have access to business: " + businessId));

                        Role role = businessUser.getRole();
                        Set<Permission> permissions = role.getPermissions();

                        // Update cache for future requests
                        permissionMap
                                .computeIfAbsent(userId, k -> new ConcurrentHashMap<>())
                                .put(businessId, permissions);

                        setBusinessContextInRequest(request, businessId, permissions, userId);
                    }
                }
            }
            filterChain.doFilter(request, response);
        } catch (AccessDeniedException e) {
            SecurityContextHolder.clearContext();
            response.sendError(HttpServletResponse.SC_FORBIDDEN, e.getMessage());
        }
    }

    /**
     * Sets business context in request attributes and updates SecurityContext with
     * permission-based authorities.
     * Converts each permission to a GrantedAuthority with the permission name
     * (e.g., "attendance.view", "customer.edit")
     */
    private void setBusinessContextInRequest(HttpServletRequest request, String businessId, Set<Permission> permissions,
            String userId) {
        // Store in request attributes for controller access
        request.setAttribute("businessId", businessId);
        request.setAttribute("permissions", permissions);

        // Convert permissions to GrantedAuthority objects
        List<GrantedAuthority> authorities = permissions.stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getName()))
                .collect(Collectors.toList());

        // Update Spring Security context with permission-based authorities
        Authentication currentAuth = SecurityContextHolder.getContext().getAuthentication();

        // Create new authentication with updated authorities
        Authentication newAuth = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                currentAuth.getPrincipal(),
                currentAuth.getCredentials(),
                authorities);

        SecurityContextHolder.getContext().setAuthentication(newAuth);
    }

    /**
     * Clears the cache for a specific user when they switch businesses or logout.
     * Can be called from authentication service when needed.
     */
    public static void clearUserCache(String userId) {
        permissionMap.remove(userId);
    }

    /**
     * Clears the specific business context for a user.
     * Useful when permissions change for a specific business.
     */
    public static void clearUserBusinessCache(String userId, String businessId) {
        Map<String, Set<Permission>> userCache = permissionMap.get(userId);
        if (userCache != null) {
            userCache.remove(businessId);
        }
    }

    /**
     * Clears all caches. Useful for testing or when roles are updated globally.
     */
    public static void clearAllCaches() {
        permissionMap.clear();
    }
}
