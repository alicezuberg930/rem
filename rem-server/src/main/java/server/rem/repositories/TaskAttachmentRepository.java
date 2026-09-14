package server.rem.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import server.rem.entities.TaskAttachment;

@Repository
public interface TaskAttachmentRepository extends JpaRepository<TaskAttachment, String> {
    /**
     * Gets one task attachment by id and verifies it belongs to the given business.
     *
     * @param id attachment id
     * @param businessId owning business id
     * @return attachment with task and business graph loaded when found
     */
    @EntityGraph(attributePaths = { "task", "task.business" })
    Optional<TaskAttachment> findByIdAndTask_Business_Id(String id, String businessId);
}
