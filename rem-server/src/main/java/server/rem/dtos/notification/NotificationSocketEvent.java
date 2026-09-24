package server.rem.dtos.notification;

public record NotificationSocketEvent(
        String type,
        NotificationResponse payload) {
    public NotificationSocketEvent(NotificationResponse payload) {
        this("NOTIFICATION", payload);
    }
}
