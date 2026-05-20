package server.rem.interceptors;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.*;
import lombok.NonNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
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

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    @Value("${jwt.access_token_secret}")
    private String accessTokenSecret;

    @Value("${jwt.refresh_token_secret}")
    private String refreshTokenSecret;

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

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws IOException {
        try {
            String refreshToken = extractToken(request, Constants.refreshTokenCookieKey);
            if (refreshToken != null) request.setAttribute("refreshToken", refreshToken);
            String accessToken = extractToken(request, Constants.accessTokenCookieKey);
            if (accessToken == null) {
                filterChain.doFilter(request, response);
                return;
            }
            JWT accessTokenJwt = new JWT(accessTokenSecret, JWTAlgorithm.HS256);
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
        } catch (Exception e) {
            resolver.resolveException(request, response, null, e);
        }
    }
}