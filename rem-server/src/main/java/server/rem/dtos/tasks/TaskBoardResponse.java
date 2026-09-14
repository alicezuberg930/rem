package server.rem.dtos.tasks;

import java.time.Instant;

import server.rem.enums.TaskPriority;
import server.rem.enums.TaskStatus;

public record TaskBoardResponse(
        String id,
        String title,
        TaskPriority priority,
        TaskStatus status,
        Instant dueDate,
        TaskUserResponse assignee) {
}
