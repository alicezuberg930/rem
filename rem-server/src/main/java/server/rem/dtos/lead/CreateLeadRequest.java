package server.rem.dtos.lead;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import server.rem.enums.LeadSource;
import server.rem.enums.LeadStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateLeadRequest {
    @NotBlank(message = "Contact ID is required")
    private String contactId;

    @NotNull(message = "Lead source is required")
    private LeadSource source;

    @NotNull(message = "Lead status is required")
    private LeadStatus status;
}
