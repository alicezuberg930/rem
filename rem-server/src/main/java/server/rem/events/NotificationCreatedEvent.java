package server.rem.events;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import server.rem.dtos.notification.NotificationResponse;

public record NotificationCreatedEvent(
        String userId,
        String title,
        String body,
        String type,
        LocalDateTime time,
        String uniqueKey,
        String link,
        String icon,
        String badge,
        Map<String, Object> data,
        String businessId,
        NotificationResponse notification) {

    public NotificationCreatedEvent(
            String userId,
            String title,
            String body,
            String type,
            LocalDateTime time,
            String uniqueKey,
            String link,
            String icon,
            String badge,
            Map<String, Object> data) {
        this(userId, title, body, type, time, uniqueKey, link, icon, badge, data, null, null);
    }

    public NotificationCreatedEvent {
        data = data == null ? Map.of() : Collections.unmodifiableMap(new HashMap<>(data));
    }
}
