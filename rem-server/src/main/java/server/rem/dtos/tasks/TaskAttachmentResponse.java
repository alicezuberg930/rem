package server.rem.dtos.tasks;

import java.time.LocalDateTime;

public record TaskAttachmentResponse(
        String id,
        String title,
        String url,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
