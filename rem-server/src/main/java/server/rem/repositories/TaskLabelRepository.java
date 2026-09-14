package server.rem.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import server.rem.entities.TaskLabel;

@Repository
public interface TaskLabelRepository extends JpaRepository<TaskLabel, String> {
    boolean existsByTask_IdAndTitleIgnoreCase(String taskId, String title);

    @EntityGraph(attributePaths = { "task", "task.business" })
    Optional<TaskLabel> findByIdAndTask_Business_Id(String id, String businessId);
}
