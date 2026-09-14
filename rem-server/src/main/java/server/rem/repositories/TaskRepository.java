package server.rem.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import server.rem.entities.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, String>, JpaSpecificationExecutor<Task> {
    @Override
    /**
     * Gets a paged list of tasks for a dynamic filter specification.
     * <p>
     * Resulting tasks include assignee and subtasks eagerly using the configured entity graph.
     *
     * @param spec filter definition to apply
     * @param pageable page request
     * @return paged tasks matching the specification
     */
    @EntityGraph(attributePaths = { "assignee", "subTask" })
    Page<Task> findAll(Specification<Task> spec, Pageable pageable);

    /**
     * Fetches all tasks for a business ordered by creation time descending.
     *
     * @param businessId owning business id
     * @return newest-to-oldest task list for that business
     */
    @EntityGraph(attributePaths = "assignee")
    List<Task> findAllByBusinessIdOrderByCreatedAtDesc(String businessId);

    /**
     * Finds one task by id within the specified business.
     *
     * @param id task id
     * @param businessId owning business id
     * @return matching task including assignee/sub-task graph when found
     */
    @EntityGraph(attributePaths = { "assignee", "subTask" })
    Optional<Task> findByIdAndBusinessId(String id, String businessId);
}
