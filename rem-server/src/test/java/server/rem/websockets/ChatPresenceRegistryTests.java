package server.rem.websockets;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ChatPresenceRegistryTests {
    private ChatPresenceRegistry presenceRegistry;

    @BeforeEach
    void setUp() {
        presenceRegistry = new ChatPresenceRegistry();
    }

    @Test
    void keepsUserOnlineUntilTheirLastSessionDisconnects() {
        assertTrue(presenceRegistry.connect("user-1", "business-a-session"));
        assertFalse(presenceRegistry.connect("user-1", "business-b-session"));
        assertEquals(Set.of("user-1"), presenceRegistry.getOnlineUserIds());

        assertFalse(presenceRegistry.disconnect("user-1", "business-a-session"));
        assertEquals(Set.of("user-1"), presenceRegistry.getOnlineUserIds());

        assertTrue(presenceRegistry.disconnect("user-1", "business-b-session"));
        assertTrue(presenceRegistry.getOnlineUserIds().isEmpty());
    }

    @Test
    void returnsAllConnectedUsersInThePresenceSnapshot() {
        presenceRegistry.connect("user-1", "session-1");
        presenceRegistry.connect("user-2", "session-2");

        assertEquals(Set.of("user-1", "user-2"), presenceRegistry.getOnlineUserIds());
    }
}
