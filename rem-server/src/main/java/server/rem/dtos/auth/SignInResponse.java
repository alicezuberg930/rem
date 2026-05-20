package server.rem.dtos.auth;

import lombok.*;

@Getter
@AllArgsConstructor
public class SignInResponse {
    private final UserProfileResponse user;

    private final String accessToken;

    private final String refreshToken;
}
