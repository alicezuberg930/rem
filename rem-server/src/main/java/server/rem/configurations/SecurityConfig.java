package server.rem.configurations;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import server.rem.dtos.APIResponse;
import server.rem.interceptors.JwtAuthFilter;
import server.rem.interceptors.BusinessContextFilter;
import server.rem.utils.messages.AuthMessages;

import java.io.IOException;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true) // Enable method-level security with @PreAuthorize and @PostAuthorize
public class SecurityConfig {
        private static final String[] PUBLIC_ROUTES = {
                        "/auth/sign-in",
                        "/auth/sign-up",
                        "/auth/refresh",
                        "/health"
        };

        private final JwtAuthFilter jwtAuthFilter;
        private final BusinessContextFilter businessContextFilter;
        private final ObjectMapper objectMapper;

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) {
                return http
                                .cors(Customizer.withDefaults())
                                .csrf(AbstractHttpConfigurer::disable)
                                .exceptionHandling(exceptions -> exceptions
                                                .authenticationEntryPoint((request, response, exception) -> writeErrorResponse(
                                                                response,
                                                                HttpStatus.UNAUTHORIZED,
                                                                "Authentication required"))
                                                .accessDeniedHandler((request, response, exception) -> writeErrorResponse(
                                                                response,
                                                                HttpStatus.FORBIDDEN,
                                                                AuthMessages.ACCESS_DENIED)))
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                                .addFilterAfter(businessContextFilter, JwtAuthFilter.class)
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(PUBLIC_ROUTES).permitAll()
                                                .anyRequest().authenticated())
                                .build();
        }

        private void writeErrorResponse(HttpServletResponse response, HttpStatus status, String message)
                        throws IOException {
                response.setStatus(status.value());
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                objectMapper.writeValue(response.getWriter(), APIResponse.error(status, message));
        }
}
