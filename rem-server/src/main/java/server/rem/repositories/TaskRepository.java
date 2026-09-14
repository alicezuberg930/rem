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
    @EntityGraph(attributePaths = { "assignee", "subTask" })
    Page<Task> findAll(Specification<Task> spec, Pageable pageable);

    @EntityGraph(attributePaths = "assignee")
    List<Task> findAllByBusinessIdOrderByCreatedAtDesc(String businessId);

    @EntityGraph(attributePaths = { "assignee", "subTask" })
    Optional<Task> findByIdAndBusinessId(String id, String businessId);
}
