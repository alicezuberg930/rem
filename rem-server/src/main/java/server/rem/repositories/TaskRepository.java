package server.rem.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import server.rem.entities.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, String>, JpaSpecificationExecutor<Task> {
    @EntityGraph(attributePaths = "assignee")
    List<Task> findAllByBusiness_IdOrderByCreatedAtDesc(String businessId);

    @EntityGraph(attributePaths = { "business", "assignee", "subTask", "labels", "attachments" })
    Optional<Task> findByIdAndBusiness_Id(String id, String businessId);
}
