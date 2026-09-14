package server.rem.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import server.rem.entities.TaskLabel;

@Repository
public interface TaskLabelRepository extends JpaRepository<TaskLabel, String> {
    /**
     * Checks if a label with the given title already exists for a task (case-insensitive).
     *
     * @param taskId target task id
     * @param title label title to check
     * @return true when a matching label exists
     */
    boolean existsByTask_IdAndTitleIgnoreCase(String taskId, String title);

    /**
     * Loads one label by id and tenant/business id.
     *
     * @param id label id
     * @param businessId owning business id
     * @return label with task and business graph loaded, if found
     */
    @EntityGraph(attributePaths = { "task", "task.business" })
    Optional<TaskLabel> findByIdAndTask_Business_Id(String id, String businessId);
}
