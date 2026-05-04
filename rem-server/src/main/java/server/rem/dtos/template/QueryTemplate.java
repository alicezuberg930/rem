package server.rem.dtos.template;

import lombok.*;
import server.rem.dtos.QueryPaginate;

@Getter
public class QueryTemplate extends QueryPaginate {
    private String contactPhone;

    public QueryTemplate(Integer pageSize, Integer page, String contactPhone) {
        super(pageSize, page);
        this.contactPhone = contactPhone;
    }
}
