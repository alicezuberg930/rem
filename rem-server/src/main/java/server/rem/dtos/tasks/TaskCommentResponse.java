package server.rem.dtos.tasks;

import java.time.LocalDateTime;

public record TaskCommentResponse(
        String id,
        String content,
        TaskUserResponse user,
        TaskCommentAttachmentResponse attachment,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
