package server.rem.websockets;

import java.util.Arrays;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import server.rem.entities.User;
import server.rem.repositories.BusinessUserRepository;
import server.rem.utils.Constants;

@Component
@RequiredArgsConstructor
public class ChatHandshakeInterceptor implements HandshakeInterceptor {
    public static final String USER_ID_ATTRIBUTE = "chatUserId";
    public static final String BUSINESS_ID_ATTRIBUTE = "chatBusinessId";

    private final BusinessUserRepository businessUserRepository;

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes) {
        if (!(request instanceof ServletServerHttpRequest servletRequest)
                || !(servletRequest.getServletRequest().getUserPrincipal() instanceof Authentication authentication)
                || !(authentication.getPrincipal() instanceof User user)) {
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        }

        String businessId = extractBusinessId(servletRequest);
        if (businessId == null || businessId.isBlank()) {
            response.setStatusCode(HttpStatus.BAD_REQUEST);
            return false;
        }

        if (businessUserRepository.findActiveByUserIdAndBusinessId(user.getId(), businessId).isEmpty()) {
            response.setStatusCode(HttpStatus.FORBIDDEN);
            return false;
        }

        attributes.put(USER_ID_ATTRIBUTE, user.getId());
        attributes.put(BUSINESS_ID_ATTRIBUTE, businessId);
        return true;
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception) {
    }

    private String extractBusinessId(ServletServerHttpRequest request) {
        if (request.getServletRequest().getCookies() == null) {
            return null;
        }
        return Arrays.stream(request.getServletRequest().getCookies())
                .filter(cookie -> Constants.businessIdCookieKey.equals(cookie.getName()))
                .map(cookie -> cookie.getValue())
                .findFirst()
                .orElse(null);
    }
}
