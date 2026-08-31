package server.rem.websockets;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.ConcurrentWebSocketSessionDecorator;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import server.rem.dtos.chat.ChatMessageRequest;
import server.rem.dtos.chat.ChatMessageResponse;
import server.rem.services.ChatService;
import server.rem.utils.exceptions.ForbiddenException;
import server.rem.utils.exceptions.ResourceNotFoundException;

@Component
@RequiredArgsConstructor
@Slf4j
public class ChatWebSocketHandler extends TextWebSocketHandler {
    private static final int SEND_TIMEOUT_MILLIS = 10_000;
    private static final int SEND_BUFFER_BYTES = 64 * 1024;

    private final ObjectMapper objectMapper;
    private final ChatService chatService;
    private final Map<String, Set<WebSocketSession>> sessions = new ConcurrentHashMap<>();
    private final Map<String, WebSocketSession> sessionsById = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        WebSocketSession concurrentSession = new ConcurrentWebSocketSessionDecorator(
                session,
                SEND_TIMEOUT_MILLIS,
                SEND_BUFFER_BYTES);
        sessionsById.put(session.getId(), concurrentSession);
        sessions.computeIfAbsent(sessionKey(session), ignored -> ConcurrentHashMap.newKeySet())
                .add(concurrentSession);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage payload) throws IOException {
        try {
            ChatMessageRequest request = objectMapper.readValue(payload.getPayload(), ChatMessageRequest.class);
            String senderId = requiredAttribute(session, ChatHandshakeInterceptor.USER_ID_ATTRIBUTE);
            String businessId = requiredAttribute(session, ChatHandshakeInterceptor.BUSINESS_ID_ATTRIBUTE);
            ChatMessageResponse message = chatService.sendMessage(senderId, businessId, request);
            TextMessage outbound = new TextMessage(objectMapper.writeValueAsString(message));

            sendToUser(businessId, message.getSenderId(), outbound);
            sendToUser(businessId, message.getRecipientId(), outbound);
        } catch (JsonProcessingException exception) {
            sendError(session, "Invalid message payload");
        } catch (IllegalArgumentException | ResourceNotFoundException | ForbiddenException exception) {
            sendError(session, exception.getMessage());
        } catch (RuntimeException exception) {
            log.error("Failed to process chat message for session {}", session.getId(), exception);
            sendError(session, "Unable to send message");
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        WebSocketSession storedSession = sessionsById.remove(session.getId());
        Set<WebSocketSession> userSessions = sessions.get(sessionKey(session));
        if (userSessions == null || storedSession == null) {
            return;
        }
        userSessions.remove(storedSession);
        if (userSessions.isEmpty()) {
            sessions.remove(sessionKey(session), userSessions);
        }
    }

    private void sendToUser(String businessId, String userId, TextMessage message) {
        String key = sessionKey(businessId, userId);
        Set<WebSocketSession> userSessions = sessions.get(key);
        if (userSessions == null) {
            return;
        }
        userSessions.removeIf(session -> {
            if (send(session, message)) {
                return false;
            }
            sessionsById.remove(session.getId(), session);
            return true;
        });
        if (userSessions.isEmpty()) {
            sessions.remove(key, userSessions);
        }
    }

    private boolean send(WebSocketSession session, TextMessage message) {
        if (!session.isOpen()) {
            return false;
        }
        try {
            session.sendMessage(message);
            return true;
        } catch (IOException | RuntimeException exception) {
            log.debug("Failed to deliver chat message to session {}", session.getId(), exception);
            return false;
        }
    }

    private void sendError(WebSocketSession session, String message) throws IOException {
        WebSocketSession outboundSession = sessionsById.getOrDefault(session.getId(), session);
        Map<String, String> error = Map.of("type", "ERROR", "message", message);
        outboundSession.sendMessage(new TextMessage(objectMapper.writeValueAsString(error)));
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
