package server.rem.dtos.tasks;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import server.rem.enums.TaskPriority;
import server.rem.enums.TaskStatus;

@Getter
@Setter
@NoArgsConstructor
public class TaskResponse {
    private String id;
    private String businessId;
    private TaskUserResponse assignee;
    private TaskReferenceResponse subTask;
    private String title;
    private TaskPriority priority;
    private TaskStatus status;
    private Instant startDate;
    private Instant dueDate;
    private String description;
    private List<TaskLabelResponse> labels;
    private List<TaskAttachmentResponse> attachments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
