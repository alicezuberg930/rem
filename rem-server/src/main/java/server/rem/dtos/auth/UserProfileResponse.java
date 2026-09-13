package server.rem.dtos.auth;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonView;

import lombok.AllArgsConstructor;
import lombok.Getter;
import server.rem.enums.AuthProvider;
import server.rem.views.Views;

@Getter
@AllArgsConstructor
public class UserProfileResponse {
    @JsonView(Views.Public.class)
    private final String id;

    @JsonView(Views.Public.class)
    private final String avatar;

    @JsonView(Views.Public.class)
    private final String birthday;

    @JsonView(Views.Public.class)
    private final LocalDateTime createdAt;

    @JsonView(Views.Public.class)
    private final String fullname;

    @JsonView(Views.Public.class)
    private final String email;

    @JsonView(Views.Public.class)
    private final String phone;

    @JsonView(Views.Public.class)
    private final AuthProvider provider;

    @JsonView(Views.Public.class)
    private final Boolean isVerified;

    @JsonView(Views.Public.class)
    private final List<UserBusinessResponse> businesses;
}
