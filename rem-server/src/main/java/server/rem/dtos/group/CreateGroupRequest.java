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
public class CreateGroupRequest {
    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String name;

    @NotBlank(message = "Avatar is required")
    @Size(max = 255, message = "Avatar cannot exceed 255 characters")
    private String avatar;

    @Valid
    @NotNull(message = "Members are required")
    @Size(min = 2, message = "At least 2 members are required")
    private List<@NotBlank(message = "Member ID is required") String> members;
}
