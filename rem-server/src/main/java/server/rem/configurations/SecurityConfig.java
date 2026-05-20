package server.rem.configurations;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.*;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import server.rem.interceptors.JwtAuthFilter;
import server.rem.interceptors.BusinessContextFilter;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true) // Enable method-level security with @PreAuthorize and @PostAuthorize
public class SecurityConfig {
        private static final String[] PUBLIC_ROUTES = {
                        "/auth/sign-in",
                        "/auth/sign-up",
                        "/auth/refresh",
        };

        private final JwtAuthFilter jwtAuthFilter;
        private final BusinessContextFilter businessContextFilter;

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) {
                return http
                                .cors(Customizer.withDefaults())
                                .csrf(AbstractHttpConfigurer::disable)
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                                .addFilterAfter(businessContextFilter, JwtAuthFilter.class)
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(PUBLIC_ROUTES).permitAll()
                                                .anyRequest().authenticated())
                                .build();
        }
}