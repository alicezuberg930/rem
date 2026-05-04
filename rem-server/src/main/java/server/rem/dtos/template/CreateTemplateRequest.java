package server.rem.dtos.template;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@AllArgsConstructor
public class CreateTemplateRequest {
    @NotBlank(message = "Template name is required")
    private final String name;

    @NotBlank(message = "Template header is required")
    private final String header;

    @NotBlank(message = "Template body is required")
    private final String body;

    private final String footer;

    private final String contactPhone;

    private final String websiteUrl;
}