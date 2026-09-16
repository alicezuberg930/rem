package server.rem.dtos.notification;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PushSubscriptionRequest(
        @NotBlank(message = "Push endpoint is required")
        @Size(max = 4096, message = "Push endpoint cannot exceed 4096 characters")
        String endpoint,
        @NotNull(message = "Push subscription keys are required")
        @Valid
        Keys keys) {

    public record Keys(
            @NotBlank(message = "p256dh key is required")
            @Size(max = 255, message = "p256dh key cannot exceed 255 characters")
            String p256dh,
            @NotBlank(message = "Auth key is required")
            @Size(max = 255, message = "Auth key cannot exceed 255 characters")
            String auth) {
    }
}
