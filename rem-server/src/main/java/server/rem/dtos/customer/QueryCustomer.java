package server.rem.dtos.customer;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import server.rem.dtos.QueryPaginate;

@Getter
@Setter
@NoArgsConstructor
public class QueryCustomer extends QueryPaginate {
    private String customerGroupId;

    public QueryCustomer(Integer pageSize, Integer page, String customerGroupId) {
        super(pageSize, page);
        this.customerGroupId = customerGroupId;
    }
}
