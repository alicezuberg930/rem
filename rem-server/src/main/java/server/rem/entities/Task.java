package server.rem.entities;

import java.time.Instant;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import server.rem.enums.TaskPriority;
import server.rem.enums.TaskStatus;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task extends Base {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id")
    private Business business;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id", nullable = true)
    private User assignee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sub_task_id")
    @JsonIgnoreProperties("subTask")
    private Task subTask;

    @Column(name = "title", length = 255)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority")
    private TaskPriority priority;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private TaskStatus status;

    @Column(name = "start_date", nullable = true)
    private Instant startDate;

    @Column(name = "due_date", nullable = true)
    private Instant dueDate;

    @Column(name = "description", columnDefinition = "LONGTEXT", nullable = true)
    private String description;

    @OneToMany(mappedBy = "task", fetch = FetchType.LAZY)
    @JsonIgnoreProperties("task")
    private Set<TaskLabel> labels;

    @OneToMany(mappedBy = "task", fetch = FetchType.LAZY)
    @JsonIgnoreProperties("task")
    private Set<TaskAttachment> attachments;
}
