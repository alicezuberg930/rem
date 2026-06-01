package server.rem.dtos.auth;

import lombok.*;

@Getter
@AllArgsConstructor
public class RefreshResponse {
    private final String accessToken;
    
    private final String accessTokenExpiration;
}
