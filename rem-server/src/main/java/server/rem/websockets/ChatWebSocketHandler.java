package server.rem.websockets;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.PingMessage;
import org.springframework.web.socket.PongMessage;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.ConcurrentWebSocketSessionDecorator;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import server.rem.dtos.chat.ChatMessageRequest;
import server.rem.dtos.chat.ChatMessageResponse;
import server.rem.dtos.chat.ChatPresenceChangedResponse;
import server.rem.dtos.chat.ChatPresenceSnapshotResponse;
import server.rem.dtos.notification.NotificationResponse;
import server.rem.dtos.notification.NotificationSocketEvent;
import server.rem.events.NotificationCreatedEvent;
import server.rem.services.ChatService;
import server.rem.services.ChatService.ChatMessageDelivery;
import server.rem.utils.exceptions.ForbiddenException;
import server.rem.utils.exceptions.ResourceNotFoundException;

@Component
@RequiredArgsConstructor
@Slf4j
public class ChatWebSocketHandler extends TextWebSocketHandler {
    private static final int SEND_TIMEOUT_MILLIS = 10_000;
    private static final int SEND_BUFFER_BYTES = 64 * 1024;
    private static final long HEARTBEAT_INTERVAL_MILLIS = 25_000;
    private static final long HEARTBEAT_TIMEOUT_MILLIS = 75_000;
    private static final CloseStatus HEARTBEAT_TIMEOUT_STATUS = new CloseStatus(4000, "Heartbeat timeout");
    private final ObjectMapper objectMapper;
    private final ChatService chatService;
    private final ChatPresenceRegistry presenceRegistry;
    private final Map<String, Set<WebSocketSession>> messageSessions = new ConcurrentHashMap<>();
    private final Map<String, WebSocketSession> sessionsById = new ConcurrentHashMap<>();
    private final Map<String, Long> lastPongAtBySessionId = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        WebSocketSession concurrentSession = new ConcurrentWebSocketSessionDecorator(
                session,
                SEND_TIMEOUT_MILLIS,
                SEND_BUFFER_BYTES);
        String userId = requiredAttribute(session, ChatHandshakeInterceptor.USER_ID_ATTRIBUTE);

        sessionsById.put(session.getId(), concurrentSession);
        messageSessions.computeIfAbsent(sessionKey(session), ignored -> ConcurrentHashMap.newKeySet())
                .add(concurrentSession);
        lastPongAtBySessionId.put(session.getId(), System.currentTimeMillis());
        boolean becameOnline = presenceRegistry.connect(userId, session.getId());

        TextMessage snapshot = toTextMessage(new ChatPresenceSnapshotResponse(presenceRegistry.getOnlineUserIds()));
        if (!send(concurrentSession, snapshot)) {
            removeSession(concurrentSession);
            closeQuietly(concurrentSession, CloseStatus.SERVER_ERROR);
            return;
        }
        if (becameOnline) {
            broadcastPresenceChange(userId, true);
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage payload) {
        try {
            ChatMessageRequest request = objectMapper.readValue(payload.getPayload(), ChatMessageRequest.class);
            String senderId = requiredAttribute(session, ChatHandshakeInterceptor.USER_ID_ATTRIBUTE);
            String businessId = requiredAttribute(session, ChatHandshakeInterceptor.BUSINESS_ID_ATTRIBUTE);
            ChatMessageDelivery delivery = chatService.sendMessageForDelivery(senderId, businessId, request);
            ChatMessageResponse message = delivery.message();
            TextMessage outbound = toTextMessage(message);

            delivery.recipientIds().forEach(userId -> sendToUser(businessId, userId, outbound));
        } catch (JsonProcessingException exception) {
            sendError(session, "Invalid message payload");
        } catch (IllegalArgumentException | ResourceNotFoundException | ForbiddenException exception) {
            sendError(session, exception.getMessage());
        } catch (RuntimeException exception) {
            log.error("Failed to process chat message for session {}", session.getId(), exception);
            sendError(session, exception.getMessage());
        }
    }

    @Override
    protected void handlePongMessage(WebSocketSession session, PongMessage message) {
        if (sessionsById.containsKey(session.getId())) {
            lastPongAtBySessionId.put(session.getId(), System.currentTimeMillis());
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        log.debug("Chat WebSocket transport error for session {}", session.getId(), exception);
        removeAndBroadcastOffline(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        removeAndBroadcastOffline(session);
    }

    @Scheduled(fixedDelay = HEARTBEAT_INTERVAL_MILLIS)
    public void sendHeartbeats() {
        long now = System.currentTimeMillis();

        for (WebSocketSession session : List.copyOf(sessionsById.values())) {
            long lastPongAt = lastPongAtBySessionId.getOrDefault(session.getId(), 0L);
            if (now - lastPongAt > HEARTBEAT_TIMEOUT_MILLIS) {
                removeAndBroadcastOffline(session);
                closeQuietly(session, HEARTBEAT_TIMEOUT_STATUS);
                continue;
            }
            if (!send(session, new PingMessage())) {
                removeAndBroadcastOffline(session);
                closeQuietly(session, CloseStatus.SERVER_ERROR);
            }
        }
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Async
    public void deliverNotification(NotificationCreatedEvent event) {
        if (event.businessId() == null || event.businessId().isBlank() || event.notification() == null) {
            return;
        }
        sendNotification(event.businessId(), event.userId(), event.notification());
    }

    public void sendNotification(String businessId, String userId, NotificationResponse notification) {
        sendToUser(businessId, userId, toTextMessage(new NotificationSocketEvent(notification)));
    }

    private void sendToUser(String businessId, String userId, TextMessage message) {
        Set<WebSocketSession> userSessions = messageSessions.get(sessionKey(businessId, userId));
        if (userSessions == null) {
            return;
        }

        for (WebSocketSession session : Set.copyOf(userSessions)) {
            if (!send(session, message)) {
                removeAndBroadcastOffline(session);
                closeQuietly(session, CloseStatus.SERVER_ERROR);
            }
        }
    }

    private void broadcastPresenceChange(String userId, boolean online) {
        TextMessage message = toTextMessage(new ChatPresenceChangedResponse(userId, online));

        for (WebSocketSession session : List.copyOf(sessionsById.values())) {
            if (!send(session, message)) {
                removeAndBroadcastOffline(session);
                closeQuietly(session, CloseStatus.SERVER_ERROR);
            }
        }
    }

    private boolean send(WebSocketSession session, WebSocketMessage<?> message) {
        if (!session.isOpen()) {
            return false;
        }
        try {
            session.sendMessage(message);
            return true;
        } catch (IOException | RuntimeException exception) {
            log.debug("Failed to deliver chat event to session {}", session.getId(), exception);
            return false;
        }
    }

    private void sendError(WebSocketSession session, String message) {
        WebSocketSession outboundSession = sessionsById.getOrDefault(session.getId(), session);
        String errorMessage = message == null || message.isBlank() ? "Unable to process chat message" : message;
        TextMessage error = toTextMessage(Map.of("type", "ERROR", "message", errorMessage));

        if (!send(outboundSession, error)) {
            removeAndBroadcastOffline(outboundSession);
            closeQuietly(outboundSession, CloseStatus.SERVER_ERROR);
        }
    }

    private Optional<String> removeSession(WebSocketSession session) {
        WebSocketSession storedSession = sessionsById.remove(session.getId());
        if (storedSession == null) {
            return Optional.empty();
        }

        lastPongAtBySessionId.remove(session.getId());
        Set<WebSocketSession> userSessions = messageSessions.get(sessionKey(storedSession));
        if (userSessions != null) {
            userSessions.remove(storedSession);
            if (userSessions.isEmpty()) {
                messageSessions.remove(sessionKey(storedSession), userSessions);
            }
        }

        String userId = requiredAttribute(storedSession, ChatHandshakeInterceptor.USER_ID_ATTRIBUTE);
        return presenceRegistry.disconnect(userId, session.getId())
                ? Optional.of(userId)
                : Optional.empty();
    }

    private void removeAndBroadcastOffline(WebSocketSession session) {
        removeSession(session).ifPresent(userId -> broadcastPresenceChange(userId, false));
    }

    private void closeQuietly(WebSocketSession session, CloseStatus status) {
        if (!session.isOpen()) {
            return;
        }
        try {
            session.close(status);
        } catch (IOException exception) {
            log.debug("Failed to close chat session {}", session.getId(), exception);
        }
    }

    private TextMessage toTextMessage(Object event) {
        try {
            return new TextMessage(objectMapper.writeValueAsString(event));
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Failed to serialize chat event", exception);
        }
    }

    private String requiredAttribute(WebSocketSession session, String name) {
        Object value = session.getAttributes().get(name);
        if (!(value instanceof String stringValue) || stringValue.isBlank()) {
            throw new IllegalArgumentException("Invalid chat session");
        }
        return stringValue;
    }

    private String sessionKey(WebSocketSession session) {
        return sessionKey(
                requiredAttribute(session, ChatHandshakeInterceptor.BUSINESS_ID_ATTRIBUTE),
                requiredAttribute(session, ChatHandshakeInterceptor.USER_ID_ATTRIBUTE));
    }

    private String sessionKey(String businessId, String userId) {
        return businessId + ':' + userId;
    }
}
