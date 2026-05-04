package server.rem.dtos.contact;

import lombok.*;
import server.rem.dtos.QueryPaginate;
import server.rem.enums.ContactType;

@Getter
public class QueryContact extends QueryPaginate {
    public QueryContact(Integer pageSize, Integer page, String customerGroupId, ContactType type) {
        super(pageSize, page);
        this.customerGroupId = customerGroupId;
        this.type = type;
    }

    private String customerGroupId;

    private ContactType type;
}
