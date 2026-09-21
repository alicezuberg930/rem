package server.rem.configurations;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class CorsProperties {
    private final List<String> allowedOriginPatterns;

    public CorsProperties(
            @Value("${app.cors.allowed-origin-patterns}") String allowedOriginPatterns
    ) {
        this.allowedOriginPatterns = Arrays.stream(allowedOriginPatterns.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .toList();
    }

    public List<String> getAllowedOriginPatterns() {
        return this.allowedOriginPatterns;
    }

    public String[] getAllowedOriginPatternsArray() {
        return this.allowedOriginPatterns.toArray(String[]::new);
    }
}
