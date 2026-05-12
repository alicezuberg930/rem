package server.rem.dtos.campaign;

import lombok.*;
import server.rem.dtos.QueryPaginate;

@Getter
public class QueryCampaign extends QueryPaginate {
    private final String contactId;

    public QueryCampaign(Integer pageSize, Integer page, String contactId) {
        super(pageSize, page);
        this.contactId = contactId;
    }
}