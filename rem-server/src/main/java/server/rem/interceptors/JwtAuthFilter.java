package server.rem.interceptors;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.*;
import lombok.NonNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import server.rem.enums.JWTAlgorithm;
import server.rem.repositories.UserRepository;
import server.rem.utils.Constants;
import server.rem.utils.JWT;
import server.rem.utils.JWTOptions;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    @Value("${jwt.access_token_secret}")
    private String accessTokenSecret;

    @Value("${jwt.refresh_token_secret}")
    private String refreshTokenSecret;

    @Value("${jwt.access_token_expiration}")
    private String accessTokenExpiration;

    private final HandlerExceptionResolver resolver;
    private final UserRepository userRepository;

    @Autowired
    public JwtAuthFilter(@Qualifier("handlerExceptionResolver") HandlerExceptionResolver resolver, UserRepository userRepository) {
        this.resolver = resolver;
        this.userRepository = userRepository;
    }

    private String extractToken(HttpServletRequest request, String tokenType) {
        if(tokenType.equals(Constants.accessTokenCookieKey)) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) return authHeader.substring(7);
        }
        if(tokenType.equals(Constants.refreshTokenCookieKey)) {
            String authHeader = request.getHeader(Constants.refreshTokenCookieKey);
            if (authHeader != null && authHeader.startsWith("Bearer ")) return authHeader.substring(7);
        }

        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            return Arrays.stream(cookies)
                    .filter(c -> c.getName().equals(tokenType))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);
        }
        return null;
    }

    private void refreshNewToken(String refreshToken, HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) {
        System.out.println("Access token invalid, attempting refresh...");
        
        try {
            JWT refreshTokenJwt = new JWT(refreshTokenSecret, JWTAlgorithm.HS256);
            Map<String, Object> decoded = refreshTokenJwt.verify(refreshToken);
            String userId = decoded.get("userId").toString();
            
            if (userId != null) {
                System.out.println("Refresh token valid, generating new access token...");
                JWTOptions accessTokenOptions = new JWTOptions(Long.parseLong(accessTokenExpiration), "rem-app", true);
                JWT newAccessTokenJwt = new JWT(accessTokenSecret, JWTAlgorithm.HS256);
                Map<String, Object> claims = Map.of("userId", userId);
                String newAccessToken = newAccessTokenJwt.sign(claims, accessTokenOptions);
                
                // Set new access token in response cookie
                long accessTokenExpSeconds = Long.parseLong(accessTokenExpiration);
                long accessTokenExpTimestamp = System.currentTimeMillis() / 1000 + accessTokenExpSeconds;

                ResponseCookie accessTokenCookie = ResponseCookie
                        .from(Constants.accessTokenCookieKey, newAccessToken)
                        .httpOnly(true)
                        .secure(true)
                        .path("/")
                        .maxAge(Duration.ofSeconds(accessTokenExpSeconds))
                        .sameSite("None")
                        .build();
                
                ResponseCookie accessTokenExpCookie = ResponseCookie
                        .from("accessTokenExp", String.valueOf(accessTokenExpTimestamp))
                        .httpOnly(false)
                        .secure(true)
                        .path("/")
                        .maxAge(Duration.ofSeconds(accessTokenExpSeconds))
                        .sameSite("None")
                        .build();

                response.addHeader(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
                response.addHeader(HttpHeaders.SET_COOKIE, accessTokenExpCookie.toString());
                
                // Set authentication context
                request.setAttribute("userId", userId);
                userRepository.findById(userId).ifPresent(user -> {
                    Authentication auth = new UsernamePasswordAuthenticationToken(user, null, List.of());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                });
                
                filterChain.doFilter(request, response);
            }
        } catch (Exception refreshError) {
            System.out.println("Refresh token invalid: " + refreshError.getMessage());
            resolver.resolveException(request, response, null, refreshError);
        }
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) {
        try {
            String refreshToken = extractToken(request, Constants.refreshTokenCookieKey);
            if (refreshToken != null) request.setAttribute("refreshToken", refreshToken);
            
            String accessToken = extractToken(request, Constants.accessTokenCookieKey);
            
            // If no access token but refresh token exists, try to refresh
            if (accessToken == null && refreshToken != null) {
                refreshNewToken(refreshToken, request, response, filterChain);
                return;
            }
            
            // If we have an access token, verify it
            if (accessToken != null) {
                JWT accessTokenJwt = new JWT(accessTokenSecret, JWTAlgorithm.HS256);
                try {
                    Map<String, Object> decoded = accessTokenJwt.verify(accessToken);
                    String userId = decoded.get("userId").toString();
                    if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        request.setAttribute("userId", userId);
                        userRepository.findById(userId).ifPresent(user -> {
                            Authentication auth = new UsernamePasswordAuthenticationToken(user, null, List.of());
                            SecurityContextHolder.getContext().setAuthentication(auth);
                        });
                    }
                    filterChain.doFilter(request, response);
                    return;
                } catch (Exception tokenExpiredException) {
                    if (refreshToken != null) { 
                        refreshNewToken(refreshToken, request, response, filterChain);
                        return;
                    } else {
                        System.out.println("No refresh token available");
                        resolver.resolveException(request, response, null, tokenExpiredException);
                        return; 
                    }
                }
            }
            
            // No access token and no refresh token, continue without authentication
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            System.out.println("Filter error: " + e.getMessage());
            // try {
            resolver.resolveException(request, response, null, e);
            // } catch (Exception resolverException) {
            //     System.out.println("Exception resolver failed: " + resolverException.getMessage());
            // }
        }
    }
}