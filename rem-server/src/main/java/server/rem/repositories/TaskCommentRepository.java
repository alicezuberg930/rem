package server.rem.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import server.rem.entities.TaskComment;

@Repository
public interface TaskCommentRepository extends JpaRepository<TaskComment, String> {
    /**
     * Gets all comments for a task ordered from oldest to newest.
     *
     * @param taskId target task id
     * @return ordered comments with comment author pre-fetched
     */
    @EntityGraph(attributePaths = "user")
    List<TaskComment> findByTaskIdOrderByCreatedAtAsc(String taskId);

    /**
     * Finds one comment by id and validates it belongs to a business tenant.
     *
     * @param id comment id
     * @param businessId owning business id
     * @return comment with task, business, and user graph loaded, if found
     */
    @EntityGraph(attributePaths = { "task", "task.business", "user" })
    Optional<TaskComment> findByIdAndTask_Business_Id(String id, String businessId);
}
