package server.rem.dtos.customer;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import server.rem.dtos.contact.ContactResponse;

@Getter
@AllArgsConstructor
public class CustomerResponse {
    private final String id;
    private final ContactResponse contact;
    private final CustomerGroupResponse customerGroup;
    private final LocalDate customerSince;
}
