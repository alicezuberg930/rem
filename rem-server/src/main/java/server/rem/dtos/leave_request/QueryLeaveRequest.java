package server.rem.dtos.leave_request;

import lombok.*;
import server.rem.dtos.QueryPaginate;

import java.time.LocalDate;

@Getter
public class QueryLeaveRequest extends QueryPaginate {
    public QueryLeaveRequest(Integer pageSize, Integer page, LocalDate startDate, LocalDate endDate) {
        super(pageSize, page);
        this.startDate = startDate;
        this.endDate = endDate;
    }

    private final LocalDate startDate;

    private final LocalDate endDate;

}
