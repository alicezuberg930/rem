package server.rem.dtos;

import lombok.*;

@Getter
@AllArgsConstructor
public class QueryPaginate {
    private Integer pageSize = 10;

    private Integer page = 0;
}