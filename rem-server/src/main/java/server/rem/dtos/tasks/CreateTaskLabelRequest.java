package server.rem.dtos.tasks;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateTaskLabelRequest {
    @NotBlank(message = "Label title is required")
    @Size(max = 255, message = "Label title must not exceed 255 characters")
    private String title;
}
