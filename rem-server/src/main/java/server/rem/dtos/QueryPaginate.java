package server.rem.dtos;

import lombok.*;

@Getter
@NoArgsConstructor
public class QueryPaginate {
    private Integer pageSize = 10;

    private Integer page = 0;

    public QueryPaginate(Integer pageSize, Integer page) {
        if(pageSize != null) this.pageSize = pageSize;
        if(page != null) this.page = page;
    }
}