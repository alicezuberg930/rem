package server.rem.dtos.tasks;

import java.time.LocalDateTime;

import server.rem.enums.TaskHistoryAction;
import server.rem.enums.TaskHistoryType;

public record TaskHistoryResponse(
        String id,
        String title,
        TaskUserResponse user,
        String fromDescription,
        String toDescription,
        TaskHistoryType type,
        TaskHistoryAction action,
        LocalDateTime createdAt) {
}
