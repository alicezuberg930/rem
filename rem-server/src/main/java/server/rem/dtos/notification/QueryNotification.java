package server.rem.dtos.notification;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import server.rem.dtos.QueryPaginate;

@Getter
@Setter
@NoArgsConstructor
public class QueryNotification extends QueryPaginate {
    private Boolean isRead;

    public QueryNotification(Integer pageSize, Integer page, Boolean isRead) {
        super(pageSize, page);
        this.isRead = isRead;
    }
}
