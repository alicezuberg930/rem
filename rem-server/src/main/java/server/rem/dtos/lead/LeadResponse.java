package server.rem.dtos.lead;

import lombok.AllArgsConstructor;
import lombok.Getter;
import server.rem.dtos.contact.ContactResponse;
import server.rem.enums.LeadSource;
import server.rem.enums.LeadStatus;

@Getter
@AllArgsConstructor
public class LeadResponse {
    private final String id;
    private final ContactResponse contact;
    private final LeadSource source;
    private final LeadStatus status;
}
