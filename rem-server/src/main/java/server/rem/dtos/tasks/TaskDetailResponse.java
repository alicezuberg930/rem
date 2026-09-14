package server.rem.dtos.tasks;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TaskDetailResponse extends TaskResponse {
    private List<TaskCommentResponse> comments;
    private List<TaskHistoryResponse> histories;
}
