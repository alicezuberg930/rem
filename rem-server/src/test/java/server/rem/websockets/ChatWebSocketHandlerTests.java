package server.rem.websockets;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.clearInvocations;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import server.rem.dtos.notification.NotificationResponse;
import server.rem.events.NotificationCreatedEvent;
import server.rem.services.ChatService;

@ExtendWith(MockitoExtension.class)
class ChatWebSocketHandlerTests {
    @Mock
    private ChatService chatService;

    private ObjectMapper objectMapper;
    private ChatPresenceRegistry presenceRegistry;
    private ChatWebSocketHandler handler;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper().findAndRegisterModules();
        presenceRegistry = new ChatPresenceRegistry();
        handler = new ChatWebSocketHandler(objectMapper, chatService, presenceRegistry);
    }

    @Test
    void broadcastsGlobalPresenceAcrossBusinessConnections() throws Exception {
        WebSocketSession firstSession = session("session-1", "user-1", "business-1");
        WebSocketSession secondSession = session("session-2", "user-2", "business-2");

        handler.afterConnectionEstablished(firstSession);
        clearInvocations(firstSession);

        handler.afterConnectionEstablished(secondSession);

        assertTrue(textEvents(firstSession).stream().anyMatch(event ->
                event.path("type").asText().equals("PRESENCE_CHANGED")
                        && event.path("userId").asText().equals("user-2")
                        && event.path("online").asBoolean()));
        JsonNode snapshot = textEvents(secondSession).stream()
                .filter(event -> event.path("type").asText().equals("PRESENCE_SNAPSHOT"))
                .findFirst()
                .orElseThrow();
        assertEquals(Set.of("user-1", "user-2"), stringSet(snapshot.path("onlineUserIds")));

        clearInvocations(secondSession);
        handler.afterConnectionClosed(firstSession, CloseStatus.NORMAL);

        assertTrue(textEvents(secondSession).stream().anyMatch(event ->
                event.path("type").asText().equals("PRESENCE_CHANGED")
                        && event.path("userId").asText().equals("user-1")
                        && !event.path("online").asBoolean()));
    }

    @Test
    void doesNotBroadcastOfflineWhileAnotherUserSessionIsConnected() throws Exception {
        WebSocketSession firstSession = session("session-1", "user-1", "business-1");
        WebSocketSession secondSession = session("session-2", "user-1", "business-2");

        handler.afterConnectionEstablished(firstSession);
        handler.afterConnectionEstablished(secondSession);
        clearInvocations(firstSession, secondSession);

        handler.afterConnectionClosed(firstSession, CloseStatus.NORMAL);

        assertEquals(Set.of("user-1"), presenceRegistry.getOnlineUserIds());
        verify(secondSession, org.mockito.Mockito.never()).sendMessage(org.mockito.ArgumentMatchers.any());
    }

    @Test
    void deliversNotificationOnlyToTargetUserInBusiness() throws Exception {
        WebSocketSession targetSession = session("session-1", "user-1", "business-1");
        WebSocketSession otherBusinessSession = session("session-2", "user-1", "business-2");
        WebSocketSession otherUserSession = session("session-3", "user-2", "business-1");
        handler.afterConnectionEstablished(targetSession);
        handler.afterConnectionEstablished(otherBusinessSession);
        handler.afterConnectionEstablished(otherUserSession);
        clearInvocations(targetSession, otherBusinessSession, otherUserSession);

        LocalDateTime now = LocalDateTime.now();
        NotificationResponse notification = new NotificationResponse(
                "notification-1",
                "business-1",
                "Task assigned",
                "Review the task",
                "4",
                now,
                false,
                "user-1",
                "task-assigned",
                now,
                now);
        handler.deliverNotification(new NotificationCreatedEvent(
                "user-1",
                notification.title(),
                notification.content(),
                notification.type(),
                notification.time(),
                notification.uniqueKey(),
                null,
                null,
                null,
                Map.of(),
                "business-1",
                notification));

        JsonNode event = textEvents(targetSession).getFirst();
        assertEquals("NOTIFICATION", event.path("type").asText());
        assertEquals("notification-1", event.path("payload").path("id").asText());
        verify(otherBusinessSession, org.mockito.Mockito.never())
                .sendMessage(org.mockito.ArgumentMatchers.any());
        verify(otherUserSession, org.mockito.Mockito.never())
                .sendMessage(org.mockito.ArgumentMatchers.any());
    }

    private WebSocketSession session(String sessionId, String userId, String businessId) {
        WebSocketSession session = mock(WebSocketSession.class);
        Map<String, Object> attributes = new HashMap<>();
        attributes.put(ChatHandshakeInterceptor.USER_ID_ATTRIBUTE, userId);
        attributes.put(ChatHandshakeInterceptor.BUSINESS_ID_ATTRIBUTE, businessId);

        when(session.getId()).thenReturn(sessionId);
        when(session.getAttributes()).thenReturn(attributes);
        when(session.isOpen()).thenReturn(true);
        return session;
    }

    private List<JsonNode> textEvents(WebSocketSession session) throws Exception {
        @SuppressWarnings("unchecked")
        ArgumentCaptor<WebSocketMessage<?>> messageCaptor = ArgumentCaptor.forClass(WebSocketMessage.class);
        verify(session, atLeastOnce()).sendMessage(messageCaptor.capture());

        List<JsonNode> events = new ArrayList<>();
        for (WebSocketMessage<?> message : messageCaptor.getAllValues()) {
            if (message instanceof TextMessage textMessage) {
                events.add(objectMapper.readTree(textMessage.getPayload()));
            }
        }
        return events;
    }

    private Set<String> stringSet(JsonNode values) {
        Set<String> strings = new java.util.HashSet<>();
        values.forEach(value -> strings.add(value.asText()));
        return strings;
    }
}
