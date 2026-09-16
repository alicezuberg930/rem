package server.rem.dtos.notification;

import java.util.Map;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateNotificationRequest {
    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    @NotBlank(message = "Type is required")
    @Size(max = 50, message = "Type cannot exceed 50 characters")
    private String type;

    @NotBlank(message = "Target user ID is required")
    @Size(max = 24, message = "Target user ID cannot exceed 24 characters")
    private String toUserId;

    @Size(max = 255, message = "Unique key cannot exceed 255 characters")
    private String uniqueKey;

    @Size(max = 2048, message = "Link cannot exceed 2048 characters")
    private String link;

    @Size(max = 2048, message = "Icon cannot exceed 2048 characters")
    private String icon;

    @Size(max = 2048, message = "Badge cannot exceed 2048 characters")
    private String badge;

    private Map<String, Object> data;
}
