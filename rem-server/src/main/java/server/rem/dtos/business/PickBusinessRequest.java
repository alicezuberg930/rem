package server.rem.dtos.business;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@AllArgsConstructor
public class PickBusinessRequest {
    @NotBlank(message = "Id is required")
    @NotEmpty(message = "Id cannot be empty")
    @NotNull(message = "Id cannot be null")
    private final String id;
}