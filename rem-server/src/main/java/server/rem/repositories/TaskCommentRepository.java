package server.rem.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import server.rem.entities.TaskComment;

@Repository
public interface TaskCommentRepository extends JpaRepository<TaskComment, String> {
    @EntityGraph(attributePaths = "user")
    List<TaskComment> findByTask_IdOrderByCreatedAtAsc(String taskId);

    @EntityGraph(attributePaths = { "task", "task.business", "user" })
    Optional<TaskComment> findByIdAndTask_Business_Id(String id, String businessId);
}
