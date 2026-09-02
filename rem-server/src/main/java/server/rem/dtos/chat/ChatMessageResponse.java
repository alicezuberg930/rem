package server.rem.dtos.chat;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ChatMessageResponse {
    @Builder.Default
    private final String type = "MESSAGE";
    private final String id;
    private final String senderId;
    private final String recipientId;
    private final String groupId;
    private final String content;
    private final LocalDateTime createdAt;
}
