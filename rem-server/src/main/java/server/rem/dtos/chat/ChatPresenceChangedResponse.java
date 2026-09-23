package server.rem.dtos.chat;

public record ChatPresenceChangedResponse(String type, String userId, boolean online) {
    public ChatPresenceChangedResponse(String userId, boolean online) {
        this("PRESENCE_CHANGED", userId, online);
    }
}
