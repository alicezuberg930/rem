// Declares this WebSocket handler belongs to the websocket package for chat message management.
package server.rem.websockets;

// Imports Java's I/O exception so outbound message failures can be handled cleanly.
import java.io.IOException;
// Imports Map for session attribute lookup and error payload creation.
import java.util.Map;
// Imports Set for tracking active sessions per user/business key.
import java.util.Set;
// Imports concurrent map utilities for thread-safe session tracking.
import java.util.concurrent.ConcurrentHashMap;

// Marks this class as a Spring bean so Spring can inject it into the websocket configuration.
import org.springframework.stereotype.Component;
// Imports CloseStatus to know why a WebSocket connection was closed.
import org.springframework.web.socket.CloseStatus;
// Imports TextMessage for sending plain JSON payloads over the socket.
import org.springframework.web.socket.TextMessage;
// Imports WebSocketSession to track each open client connection.
import org.springframework.web.socket.WebSocketSession;
// Imports a session decorator that enforces send timeouts and buffer limits.
import org.springframework.web.socket.handler.ConcurrentWebSocketSessionDecorator;
// Imports the base Spring class for text-based WebSocket handlers.
import org.springframework.web.socket.handler.TextWebSocketHandler;

// Imports Jackson exception type used when incoming JSON is malformed.
import com.fasterxml.jackson.core.JsonProcessingException;
// Imports ObjectMapper to convert between Java objects and JSON for chat messages.
import com.fasterxml.jackson.databind.ObjectMapper;

// Imports Lombok to generate constructor injection for final dependencies.
import lombok.RequiredArgsConstructor;
// Imports Slf4j logging for debug and error reporting during socket operations.
import lombok.extern.slf4j.Slf4j;
// Imports the incoming chat request DTO that contains the message payload from the client.
import server.rem.dtos.chat.ChatMessageRequest;
// Imports the outgoing chat response DTO that the server sends back to the client.
import server.rem.dtos.chat.ChatMessageResponse;
// Imports the chat business logic service that validates and records chat messages.
import server.rem.services.ChatService;
// Imports the inner record returned by the service to include message + recipient IDs.
import server.rem.services.ChatService.ChatMessageDelivery;
// Imports the business rule exception used when a user is not allowed to send the message.
import server.rem.utils.exceptions.ForbiddenException;
// Imports the not-found exception used when referenced chat resources are missing.
import server.rem.utils.exceptions.ResourceNotFoundException;

// Registers this handler as a Spring-managed bean for the WebSocket registry.
@Component
// Generates a constructor that fills all final fields automatically.
@RequiredArgsConstructor
// Enables logger support for socket-related diagnostics.
@Slf4j
public class ChatWebSocketHandler extends TextWebSocketHandler {
    // Sets the maximum time allowed to wait when sending a WebSocket message.
    private static final int SEND_TIMEOUT_MILLIS = 10_000;
    // Sets the maximum payload size allowed per outgoing send before a socket is considered overloaded.
    private static final int SEND_BUFFER_BYTES = 64 * 1024;

    // Holds JSON serialization/deserialization utilities for chat payloads.
    private final ObjectMapper objectMapper;
    // Holds the service responsible for validating and persisting chat messages.
    private final ChatService chatService;
    // Tracks all active WebSocket sessions grouped by businessId:userId so a message can be sent to the right user(s).
    private final Map<String, Set<WebSocketSession>> sessions = new ConcurrentHashMap<>();
    // Tracks each session by its socket ID so the server can look up a live session during disconnects or error replies.
    private final Map<String, WebSocketSession> sessionsById = new ConcurrentHashMap<>();

    // Called whenever a new WebSocket connection is successfully established.
    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        // Wraps the raw session with a decorator that enforces send-time and buffer constraints.
        WebSocketSession concurrentSession = new ConcurrentWebSocketSessionDecorator(
                session,
                SEND_TIMEOUT_MILLIS,
                SEND_BUFFER_BYTES);
        // Stores the wrapped session under its generated socket ID for quick lookup later.
        sessionsById.put(session.getId(), concurrentSession);
        // Creates or gets the set of sessions for this user/business and adds the connection to it.
        sessions.computeIfAbsent(sessionKey(session), ignored -> ConcurrentHashMap.newKeySet())
                .add(concurrentSession);
    }

    // Handles each incoming text message from a connected client.
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage payload) throws IOException {
        try {
            // Parses the incoming JSON into a chat message request object.
            ChatMessageRequest request = objectMapper.readValue(payload.getPayload(), ChatMessageRequest.class);
            // Pulls the sender's user ID from the session attributes that were set during the handshake.
            String senderId = requiredAttribute(session, ChatHandshakeInterceptor.USER_ID_ATTRIBUTE);
            // Pulls the business ID from the handshake attributes so the message is handled in the correct business scope.
            String businessId = requiredAttribute(session, ChatHandshakeInterceptor.BUSINESS_ID_ATTRIBUTE);
            // Sends the message through the chat service to validate business rules and determine recipients.
            ChatMessageDelivery delivery = chatService.sendMessageForDelivery(senderId, businessId, request);
            // Extracts the message response object to be broadcast back to the recipients.
            ChatMessageResponse message = delivery.message();
            // Serializes the outgoing message to JSON so it can be sent through the WebSocket.
            TextMessage outbound = new TextMessage(objectMapper.writeValueAsString(message));

            // Broadcasts the message to every recipient user in the target business.
            delivery.recipientIds().forEach(userId -> sendToUser(businessId, userId, outbound));
        } catch (JsonProcessingException exception) {
            // Sends a structured error back when the supplied message JSON cannot be parsed.
            sendError(session, "Invalid message payload");
        } catch (IllegalArgumentException | ResourceNotFoundException | ForbiddenException exception) {
            // Sends a client-facing error when validation or access rules fail.
            sendError(session, exception.getMessage());
        } catch (RuntimeException exception) {
            // Logs unexpected failures before notifying the client.
            log.error("Failed to process chat message for session {}", session.getId(), exception);
            // Sends the runtime exception message so the client sees a meaningful failure.
            sendError(session, exception.getMessage());
        }
    }

    // Called when the client disconnects so the server can clean up session tracking.
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        // Removes the closed session from the ID lookup map.
        WebSocketSession storedSession = sessionsById.remove(session.getId());
        // Finds the group of sessions for the same business/user pair as the disconnected connection.
        Set<WebSocketSession> userSessions = sessions.get(sessionKey(session));
        // Exits early if there is no tracked session for this user or if the stored session was already absent.
        if (userSessions == null || storedSession == null) {
            return;
        }
        // Removes the actual session instance from the set of active sessions for that user.
        userSessions.remove(storedSession);
        // Deletes the entire user/business key when no sessions remain for that user.
        if (userSessions.isEmpty()) {
            sessions.remove(sessionKey(session), userSessions);
        }
    }

    // Sends one outbound message to all currently connected sockets for a specific business/user pair.
    private void sendToUser(String businessId, String userId, TextMessage message) {
        // Creates the composite key used to look up sessions for this business and user.
        String key = sessionKey(businessId, userId);
        // Gets the set of sessions active for that user in this business.
        Set<WebSocketSession> userSessions = sessions.get(key);
        // Exits when there are no active sessions for that recipient.
        if (userSessions == null) {
            return;
        }
        // Attempts to deliver the message to each active session and removes dead sessions from the set.
        userSessions.removeIf(session -> {
            if (send(session, message)) {
                return false;
            }
            sessionsById.remove(session.getId(), session);
            return true;
        });
        // Removes the key entirely if the last user session has been cleaned up.
        if (userSessions.isEmpty()) {
            sessions.remove(key, userSessions);
        }
    }

    // Sends a single text message if the session is still open and returns whether delivery succeeded.
    private boolean send(WebSocketSession session, TextMessage message) {
        // Refuses to send anything if the socket is already closed.
        if (!session.isOpen()) {
            return false;
        }
        try {
            // Sends the encoded message through the established WebSocket connection.
            session.sendMessage(message);
            // Reports success so the session can remain in the active set.
            return true;
        } catch (IOException | RuntimeException exception) {
            // Logs delivery failures without crashing the whole message broadcast.
            log.debug("Failed to deliver chat message to session {}", session.getId(), exception);
            // Returns false so the dead session can be removed from tracking.
            return false;
        }
    }

    // Sends a JSON error payload back to the same client that triggered the problem.
    private void sendError(WebSocketSession session, String message) throws IOException {
        // Falls back to the current session if it is not present in the ID map, maintaining compatibility with already-closed connections.
        WebSocketSession outboundSession = sessionsById.getOrDefault(session.getId(), session);
        // Builds a compact error object that the front end can parse as a structured chat error.
        Map<String, String> error = Map.of("type", "ERROR", "message", message);
        // Serializes the error object to JSON and sends it over the socket.
        outboundSession.sendMessage(new TextMessage(objectMapper.writeValueAsString(error)));
    }

    // Validates that a required attribute exists on the WebSocket session and is a non-blank string.
    private String requiredAttribute(WebSocketSession session, String name) {
        // Reads the raw attribute from the session map.
        Object value = session.getAttributes().get(name);
        // Rejects missing or invalid values before proceeding.
        if (!(value instanceof String stringValue) || stringValue.isBlank()) {
            throw new IllegalArgumentException("Invalid chat session");
        }
        // Returns the validated value for use in business logic.
        return stringValue;
    }

    // Builds the session key from the current WebSocket session's stored business and user attributes.
    private String sessionKey(WebSocketSession session) {
        return sessionKey(
                requiredAttribute(session, ChatHandshakeInterceptor.BUSINESS_ID_ATTRIBUTE),
                requiredAttribute(session, ChatHandshakeInterceptor.USER_ID_ATTRIBUTE));
    }

    // Creates a composite lookup key from a business ID and a user ID.
    private String sessionKey(String businessId, String userId) {
        // Concatenates the values with a colon so the key is unique per business/user combination.
        return businessId + ':' + userId;
    }
}
