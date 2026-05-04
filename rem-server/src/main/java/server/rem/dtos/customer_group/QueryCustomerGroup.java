package server.rem.dtos.customer_group;

import lombok.*;
import server.rem.dtos.QueryPaginate;

@Getter
public class QueryCustomerGroup extends QueryPaginate {
    public QueryCustomerGroup(Integer pageSize, Integer page) {
        super(pageSize, page);
    }
}
