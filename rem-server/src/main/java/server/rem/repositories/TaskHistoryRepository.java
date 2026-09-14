package server.rem.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import server.rem.entities.TaskHistory;

@Repository
public interface TaskHistoryRepository extends JpaRepository<TaskHistory, String> {
    @EntityGraph(attributePaths = "user")
    List<TaskHistory> findByTask_IdOrderByCreatedAtDesc(String taskId);
}
