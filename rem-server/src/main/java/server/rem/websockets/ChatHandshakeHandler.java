package server.rem.websockets;

import java.util.List;

import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

public class ChatHandshakeHandler extends DefaultHandshakeHandler {
    @Override
    protected String selectProtocol(List<String> requestedProtocols, WebSocketHandler webSocketHandler) {
        return requestedProtocols.stream()
                .filter(protocol -> protocol.startsWith(ChatHandshakeInterceptor.BUSINESS_PROTOCOL_PREFIX))
                .findFirst()
                .orElse(null);
    }
}
