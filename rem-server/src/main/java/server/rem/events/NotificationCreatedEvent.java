package server.rem.events;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

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
        Map<String, Object> data) {

    public NotificationCreatedEvent {
        data = data == null ? Map.of() : Collections.unmodifiableMap(new HashMap<>(data));
    }
}
