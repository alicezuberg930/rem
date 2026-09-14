package server.rem.dtos.tasks;

import java.time.Instant;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import server.rem.enums.TaskPriority;
import server.rem.enums.TaskStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateTaskRequest {
    @NotBlank(message = "Assignee ID is required")
    private String assigneeId;

    private String subTaskId;

    @Size(max = 255, message = "Task title must not exceed 255 characters")
    private String title;

    private TaskPriority priority;

    private TaskStatus status;

    private Instant startDate;

    private Instant dueDate;

    private String description;
}
