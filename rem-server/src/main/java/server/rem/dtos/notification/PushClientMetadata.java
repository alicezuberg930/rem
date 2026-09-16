package server.rem.dtos.notification;

public record PushClientMetadata(
        String ip,
        String browser,
        String deviceType,
        String deviceVendor,
        String deviceModel,
        String cpu,
        String os) {
}
