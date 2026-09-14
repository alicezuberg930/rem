package server.rem.dtos.tasks;

import server.rem.enums.TaskStatus;

public record TaskReferenceResponse(
        String id,
        String title,
        TaskStatus status) {
}
