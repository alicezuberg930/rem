package server.rem.dtos.variant;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CreateVariantRequest {
    @NotBlank(message = "Variant name is required")
    @Size(max = 255, message = "Variant name must be at most 255 characters")
    private String name;

    @Valid
    @NotEmpty(message = "At least one variant option is required")
    private List<VariantOptionRequest> options;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VariantOptionRequest {
        private String id;

        @NotBlank(message = "Variant option value is required")
        @Size(max = 255, message = "Variant option value must be at most 255 characters")
        private String value;
    }
}
