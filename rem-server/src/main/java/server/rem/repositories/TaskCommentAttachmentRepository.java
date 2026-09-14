package server.rem.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import server.rem.entities.TaskCommentAttachment;

@Repository
public interface TaskCommentAttachmentRepository extends JpaRepository<TaskCommentAttachment, String> {
    /**
     * Loads attachments for all comments under a specific task.
     *
     * @param taskId target task id
     * @return attachments linked through task comments for that task
     */
    List<TaskCommentAttachment> findByTaskComment_Task_Id(String taskId);

    /**
     * Loads attachments attached to one specific task comment.
     *
     * @param taskCommentId target task comment id
     * @return attachments belonging to that comment
     */
    List<TaskCommentAttachment> findByTaskComment_Id(String taskCommentId);
}
