package server.rem.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import server.rem.entities.TaskHistory;

@Repository
public interface TaskHistoryRepository extends JpaRepository<TaskHistory, String> {
    /**
     * Returns a task's history entries in reverse chronological order.
     *
     * @param taskId target task id
     * @return history list sorted by createdAt descending, with actor/user graph initialized
     */
    @EntityGraph(attributePaths = "user")
    List<TaskHistory> findByTask_IdOrderByCreatedAtDesc(String taskId);
}
