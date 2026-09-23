package server.rem.dtos.variant;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import server.rem.dtos.QueryPaginate;

@Getter
@Setter
@NoArgsConstructor
public class QueryVariant extends QueryPaginate {
    private String name;

    public QueryVariant(Integer pageSize, Integer page, String name) {
        super(pageSize, page);
        this.name = name;
    }
}
