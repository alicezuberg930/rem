package server.rem.dtos.auth;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonView;

import lombok.*;
import server.rem.views.Views;

@Getter
@AllArgsConstructor
public class RoleResponse {
    @JsonView(Views.Public.class)
    private final String name;

    @JsonView(Views.Public.class)
    private final String description;

    @JsonView(Views.Me.class)
    private final List<PermissionResponse> permissions;
}
