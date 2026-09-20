// Declares this class as a Spring configuration for WebSocket setup.
package server.rem.configurations;

// Imports the Spring config annotation that marks this class as a configuration source.
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import lombok.RequiredArgsConstructor;
import server.rem.websockets.ChatHandshakeInterceptor;
import server.rem.websockets.ChatWebSocketHandler;

// Tells Spring to load this class as part of the application configuration.
@Configuration
// Enables WebSocket infrastructure in the application context.
@EnableWebSocket
// Generates the constructor that injects the required final dependencies.
@RequiredArgsConstructor
public class WebsocketConfig implements WebSocketConfigurer {

    // Stores the handler that deals with actual chat message traffic.
    private final ChatWebSocketHandler chatWebSocketHandler;
    // Stores the interceptor that validates the connection before allowing the socket to open.
    private final ChatHandshakeInterceptor chatHandshakeInterceptor;

    // Registers the WebSocket endpoint and its security-related settings.
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // Adds the chat endpoint at /ws/chat and attaches the handshake validation logic.
        registry.addHandler(chatWebSocketHandler, "/ws/chat")
                // Runs the handshake interceptor before the connection is accepted.
                .addInterceptors(chatHandshakeInterceptor)
                .setAllowedOriginPatterns(
                        "http://localhost:*",
                        "http://127.0.0.1:*",
                        "https://yvonne-one.vercel.app");
    }
}
