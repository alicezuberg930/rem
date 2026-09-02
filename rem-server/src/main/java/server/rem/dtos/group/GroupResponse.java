package server.rem.dtos.group;

import java.util.List;
import lombok.Builder;
import lombok.Getter;
import server.rem.dtos.chat.ChatUserResponse;

@Getter
@Builder
public class GroupResponse {
    private final String id;
    private final String name;
    private final String avatar;
    private final List<ChatUserResponse> members;
}
