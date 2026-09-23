package server.rem.dtos.variant;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class VariantResponse {
    private final String id;
    private final String name;
    private final List<VariantOptionResponse> options;

    @Getter
    @AllArgsConstructor
    public static class VariantOptionResponse {
        private final String id;
        private final String value;
    }
}
