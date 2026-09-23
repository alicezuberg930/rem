package server.rem.dtos.chat;

import java.util.Set;

public record ChatPresenceSnapshotResponse(String type, Set<String> onlineUserIds) {
    public ChatPresenceSnapshotResponse(Set<String> onlineUserIds) {
        this("PRESENCE_SNAPSHOT", Set.copyOf(onlineUserIds));
    }
}
