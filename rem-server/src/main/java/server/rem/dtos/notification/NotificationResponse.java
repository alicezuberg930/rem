package server.rem.dtos.notification;

import java.time.LocalDateTime;

public record NotificationResponse(
        String id,
        String businessId,
        String title,
        String content,
        String type,
        LocalDateTime time,
        boolean isRead,
        String toUserId,
        String uniqueKey,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
