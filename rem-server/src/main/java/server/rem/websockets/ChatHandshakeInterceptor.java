package server.rem.websockets;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.server.HandshakeInterceptor;

import lombok.RequiredArgsConstructor;
import server.rem.entities.User;
import server.rem.repositories.BusinessUserRepository;

// Registers this interceptor as a Spring bean so it can participate in WebSocket handshake validation.
@Component
// Generates the constructor that accepts all final fields automatically.
@RequiredArgsConstructor
public class ChatHandshakeInterceptor implements HandshakeInterceptor {

    // Stores the request attribute name used to save the authenticated user ID in the session.
    public static final String USER_ID_ATTRIBUTE = "chatUserId";
    // Stores the request attribute name used to save the selected business ID in the session.
    public static final String BUSINESS_ID_ATTRIBUTE = "chatBusinessId";
    public static final String BUSINESS_PROTOCOL_PREFIX = "business-id.";

    // Holds the repository used to confirm that the user is active in the target business.
    private final BusinessUserRepository businessUserRepository;

    // Runs before the WebSocket connection is accepted and validates the user's identity and business access.
    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes) {
        // Verifies the incoming request is a servlet-based request and that it contains a valid authenticated user.
        if (!(request instanceof ServletServerHttpRequest servletRequest) || !(servletRequest.getServletRequest().getUserPrincipal() instanceof Authentication authentication) || !(authentication.getPrincipal() instanceof User user)) {
            // Rejects the connection when no authenticated user is present.
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            // Stops the handshake because the session is not authorized.
            return false;
        }

        // Browsers cannot set custom WebSocket headers, so the business ID is sent
        // in the Sec-WebSocket-Protocol header and validated here.
        String businessId = new WebSocketHttpHeaders(request.getHeaders())
                .getSecWebSocketProtocol()
                .stream()
                .filter(protocol -> protocol.startsWith(BUSINESS_PROTOCOL_PREFIX))
                .map(protocol -> protocol.substring(BUSINESS_PROTOCOL_PREFIX.length()))
                .filter(id -> !id.isBlank())
                .findFirst()
                .orElse(null);
        // Checks whether the business ID is missing or blank before continuing.
        if (businessId == null || businessId.isBlank()) {
            // Marks the request as bad if the client didn't provide a valid business identifier.
            response.setStatusCode(HttpStatus.BAD_REQUEST);
            // Prevents the WebSocket from being established without a business context.
            return false;
        }

        // Validates that the authenticated user is currently active for the requested business.
        if (businessUserRepository.findActiveByUserIdAndBusinessId(user.getId(), businessId).isEmpty()) {
            // Rejects the connection when the user is not allowed in that business.
            response.setStatusCode(HttpStatus.FORBIDDEN);
            // Prevents the handshake from proceeding for unauthorized users.
            return false;
        }

        // Saves the authenticated user's ID into the WebSocket session attributes for later message handling.
        attributes.put(USER_ID_ATTRIBUTE, user.getId());
        // Saves the business ID into the WebSocket session attributes so the chat service can route messages correctly.
        attributes.put(BUSINESS_ID_ATTRIBUTE, businessId);
        // Allows the WebSocket connection to continue because validation passed.
        return true;
    }

    // Runs after the handshake completes; this implementation intentionally does nothing.
    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception) {
    }

}
