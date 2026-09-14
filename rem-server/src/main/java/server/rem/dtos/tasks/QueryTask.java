package server.rem.dtos.tasks;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import server.rem.dtos.QueryPaginate;
import server.rem.enums.TaskPriority;
import server.rem.enums.TaskStatus;

@Getter
@Setter
@NoArgsConstructor
public class QueryTask extends QueryPaginate {
    public QueryTask(Integer pageSize, Integer page, TaskStatus status, TaskPriority priority, String filter) {
        super(pageSize, page);
        this.status = status;
        this.priority = priority;
        this.filter = filter;
    }

    private TaskStatus status;
    private TaskPriority priority;
    private String filter;
}
