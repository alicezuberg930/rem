package server.rem.dtos.lead;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import server.rem.dtos.QueryPaginate;
import server.rem.enums.LeadSource;
import server.rem.enums.LeadStatus;

@Getter
@Setter
@NoArgsConstructor
public class QueryLead extends QueryPaginate {
    private LeadSource source;
    private LeadStatus status;

    public QueryLead(Integer pageSize, Integer page, LeadSource source, LeadStatus status) {
        super(pageSize, page);
        this.source = source;
        this.status = status;
    }
}
