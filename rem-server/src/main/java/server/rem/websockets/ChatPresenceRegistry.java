package server.rem.websockets;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;

import org.springframework.stereotype.Component;

@Component
public class ChatPresenceRegistry {
    private final ConcurrentHashMap<String, Set<String>> sessionIdsByUserId = new ConcurrentHashMap<>();

    public boolean connect(String userId, String sessionId) {
        AtomicBoolean becameOnline = new AtomicBoolean(false);

        sessionIdsByUserId.compute(userId, (ignored, sessionIds) -> {
            Set<String> activeSessionIds = sessionIds;
            if (activeSessionIds == null) {
                activeSessionIds = ConcurrentHashMap.newKeySet();
            }
            if (activeSessionIds.add(sessionId) && activeSessionIds.size() == 1) {
                becameOnline.set(true);
            }
            return activeSessionIds;
        });

        return becameOnline.get();
    }

    public boolean disconnect(String userId, String sessionId) {
        AtomicBoolean becameOffline = new AtomicBoolean(false);

        sessionIdsByUserId.computeIfPresent(userId, (ignored, sessionIds) -> {
            sessionIds.remove(sessionId);
            if (sessionIds.isEmpty()) {
                becameOffline.set(true);
                return null;
            }
            return sessionIds;
        });

        return becameOffline.get();
    }

    public Set<String> getOnlineUserIds() {
        return Set.copyOf(sessionIdsByUserId.keySet());
    }
}
