package server.rem.dtos.lead;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConvertLeadsRequest {
    @NotEmpty(message = "Lead IDs are required")
    private List<String> leadIds;
}
