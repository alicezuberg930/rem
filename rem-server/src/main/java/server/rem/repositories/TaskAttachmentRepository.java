package server.rem.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import server.rem.entities.TaskAttachment;

@Repository
public interface TaskAttachmentRepository extends JpaRepository<TaskAttachment, String> {
    @EntityGraph(attributePaths = { "task", "task.business" })
    Optional<TaskAttachment> findByIdAndTask_Business_Id(String id, String businessId);
}
