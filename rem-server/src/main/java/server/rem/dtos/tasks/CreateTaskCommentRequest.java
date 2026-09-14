package server.rem.dtos.tasks;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateTaskCommentRequest {
    @NotBlank(message = "Comment content is required")
    private String content;
}
