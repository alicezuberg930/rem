package server.rem.dtos.attendance;

import lombok.*;
import server.rem.dtos.QueryPaginate;

import java.time.LocalDate;

@Getter
public class QueryAttendance extends QueryPaginate {
    public QueryAttendance(Integer pageSize, Integer page, LocalDate startDate, LocalDate endDate) {
        super(pageSize, page);
        this.startDate = startDate;
        this.endDate = endDate;
    }

    private LocalDate startDate;

    private LocalDate endDate;
}
