package server.rem.dtos.media;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OwnerResponse {
    private final String id;
    private final String fullname;
    private final String email;
    private final String avatar;
}
