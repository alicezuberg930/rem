package server.rem.dtos.group;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AddUsersToGroupRequest {
    @NotBlank(message = "Group ID is required")
    private String groupId;

    @Valid
    @NotNull(message = "Members are required")
    @Size(min = 1, message = "At least 1 member is required")
    private List<@NotBlank(message = "Member ID is required") String> members;
}
