package server.rem.dtos.calendar_event;

import lombok.*;
import server.rem.dtos.QueryPaginate;

import java.time.LocalDate;

@Getter
public class QueryCalendarEvent extends QueryPaginate {
    public QueryCalendarEvent(Integer pageSize, Integer page, LocalDate startDate, LocalDate endDate, String createdById) {
        super(pageSize, page);
        this.startDate = startDate;
        this.endDate = endDate;
        this.createdById = createdById;
    }

    private final LocalDate startDate;

    private final LocalDate endDate;

    private final String createdById;
}