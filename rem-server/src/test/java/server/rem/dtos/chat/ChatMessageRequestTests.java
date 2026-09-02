package server.rem.dtos.chat;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

class ChatMessageRequestTests {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void deserializesWebSocketPayload() throws Exception {
        ChatMessageRequest request = objectMapper.readValue(
                "{\"recipientId\":\"recipient-id\",\"content\":\"hello\"}",
                ChatMessageRequest.class);

        assertEquals("recipient-id", request.getRecipientId());
        assertNull(request.getGroupId());
        assertEquals("hello", request.getContent());
    }

    @Test
    void deserializesGroupWebSocketPayload() throws Exception {
        ChatMessageRequest request = objectMapper.readValue(
                "{\"groupId\":\"group-id\",\"content\":\"hello\"}",
                ChatMessageRequest.class);

        assertNull(request.getRecipientId());
        assertEquals("group-id", request.getGroupId());
        assertEquals("hello", request.getContent());
    }
}
