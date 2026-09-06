package server.rem.dtos.contact;

import lombok.*;
import server.rem.dtos.QueryPaginate;
import server.rem.enums.ContactType;

@Getter
@Setter
@NoArgsConstructor
public class QueryContact extends QueryPaginate {
    public QueryContact(Integer pageSize, Integer page, ContactType type) {
        super(pageSize, page);
        this.type = type;
    }

    private ContactType type;
}
