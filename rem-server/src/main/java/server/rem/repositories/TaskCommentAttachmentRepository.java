package server.rem.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import server.rem.entities.TaskCommentAttachment;

@Repository
public interface TaskCommentAttachmentRepository extends JpaRepository<TaskCommentAttachment, String> {
    List<TaskCommentAttachment> findByTaskComment_Task_Id(String taskId);

    List<TaskCommentAttachment> findByTaskComment_Id(String taskCommentId);
}
