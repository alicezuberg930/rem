package server.rem.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import server.rem.enums.TaskHistoryAction;
import server.rem.enums.TaskHistoryType;

@Entity
@Table(name = "task_histories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskHistory extends Base {
    @Column(name = "title", length = 255)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "from_description", length = 255, nullable = true)
    private String fromDescription;

    @Column(name = "to_description", length = 255, nullable = true)
    private String toDescription;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private TaskHistoryType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "action")
    private TaskHistoryAction action;
}
