package server.rem.dtos.chat;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChatMessageRequest {
    private String recipientId;
    private String groupId;
    private String content;

    public ChatMessageRequest(String recipientId, String content) {
        this(recipientId, null, content);
    }

    public ChatMessageRequest(String recipientId, String groupId, String content) {
        this.recipientId = recipientId;
        this.groupId = groupId;
        this.content = content;
    }
}
