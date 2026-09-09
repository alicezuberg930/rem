package server.rem.utils;

import java.util.Collection;
import java.util.Set;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import server.rem.entities.Permission;
import server.rem.entities.User;
import server.rem.interceptors.BusinessContextFilter;

/**
 * Utility class to access current business context and permissions in
 * controllers and services.
 *
 * Usage in controllers:
 * <pre>
 * @GetMapping("/data")
 * public ResponseEntity<?> getData() { String businessId =
 * BusinessContextUtil.getCurrentBusinessId(); Set<Permission> permissions =
 * BusinessContextUtil.getCurrentPermissions(); if
 * (BusinessContextUtil.hasPermission("attendance.view")) { // Show attendance
 * data } }
 * </pre>
 */
public class BusinessContextUtil {

    /**
     * Get the current business ID from the request context. Returns null if no
     * business context is set.
     */
    public static String getCurrentBusinessId() {
        HttpServletRequest request = getRequest();
        if (request != null) {
            Object businessId = request.getAttribute("businessId");
            return businessId != null ? businessId.toString() : null;
        }
        return null;
    }

    /**
     * Get the current user's permissions in the business. Returns empty set if
     * no permissions are set.
     */
    @SuppressWarnings("unchecked")
    public static Set<Permission> getCurrentPermissions() {
        HttpServletRequest request = getRequest();
        if (request != null) {
            Object permissions = request.getAttribute("permissions");
            if (permissions instanceof Set) {
                return (Set<Permission>) permissions;
            }
        }
        return Set.of();
    }

    /**
     * Check if the current user has a specific permission. Checks both: 1.
     * Request attributes (permissions set by BusinessContextFilter) 2. Spring
     * Security authorities (GrantedAuthority names)
     *
     * Usage examples: - hasPermission("attendance.view") -
     * hasPermission("customer.create") - hasPermission("payroll.edit")
     */
    public static boolean hasPermission(String permissionName) {
        if (permissionName == null || permissionName.isEmpty()) {
            return false;
        }
        // Check in request attributes first (from BusinessContextFilter)
        Set<Permission> permissions = getCurrentPermissions();
        if (!permissions.isEmpty()) {
            return permissions.stream()
                    .anyMatch(p -> p.getName().equals(permissionName));
        }
        // Fallback: check in Spring Security authorities
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
            return authorities.stream()
                    .anyMatch(a -> a.getAuthority().equals(permissionName));
        }
        return false;
    }

    /**
     * Check if the current user has ANY of the provided permissions.
     */
    public static boolean hasAnyPermission(String... permissionNames) {
        for (String permissionName : permissionNames) {
            if (hasPermission(permissionName)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if the current user has ALL of the provided permissions.
     */
    public static boolean hasAllPermissions(String... permissionNames) {
        for (String permissionName : permissionNames) {
            if (!hasPermission(permissionName)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Get the current user ID from the security context. Returns null if no
     * user is authenticated.
     */
    public static String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            Object principal = auth.getPrincipal();
            switch (principal) {
                case User user -> {
                    return user.getId();
                }
                case String string -> {
                    return string;
                }
                default -> {
                }
            }
        }
        return null;
    }

    /**
     * Get the current user ID from the request attributes (set by
     * JwtAuthMiddleware).
     */
    public static String getCurrentUserIdFromRequest() {
        HttpServletRequest request = getRequest();
        if (request != null) {
            Object userId = request.getAttribute("userId");
            return userId != null ? userId.toString() : null;
        }
        return null;
    }

    /**
     * Invalidate the cached permissions for the current user when their
     * roles/permissions change. Call this after updating a user's permissions
     * in a business.
     */
    public static void invalidateCurrentUserCache() {
        String userId = getCurrentUserId();
        if (userId != null) {
            BusinessContextFilter.clearUserCache(userId);
        }
    }

    /**
     * Invalidate the cached permissions for a specific user and business. Call
     * this when updating a user's permissions in a specific business.
     */
    public static void invalidateUserBusinessCache(String userId, String businessId) {
        if (userId != null && businessId != null) {
            BusinessContextFilter.clearUserBusinessCache(userId, businessId);
        }
    }

    /**
     * Clear all cached permissions globally. Use with caution - typically only
     * for testing or during maintenance.
     */
    public static void clearAllCaches() {
        BusinessContextFilter.clearAllCaches();
    }

    /**
     * Get the current HTTP request from the RequestContextHolder.
     */
    private static HttpServletRequest getRequest() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return attributes != null ? attributes.getRequest() : null;
    }
}
