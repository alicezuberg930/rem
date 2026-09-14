package server.rem.dtos.tasks;

import java.time.LocalDateTime;

public record TaskCommentAttachmentResponse(
        String id,
        String title,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
