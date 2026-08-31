package server.rem.dtos.chat;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ChatUserResponse {
    private final String id;
    private final String fullname;
    private final String email;
    private final String avatar;
}
