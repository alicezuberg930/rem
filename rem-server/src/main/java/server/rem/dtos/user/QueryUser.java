package server.rem.dtos.user;

import lombok.*;
import server.rem.dtos.QueryPaginate;

@Getter
public class QueryUser extends QueryPaginate {
    public QueryUser(Integer pageSize, Integer page, String role) {
        super(pageSize, page);
        this.role = role;
    }

    private final String role;
}