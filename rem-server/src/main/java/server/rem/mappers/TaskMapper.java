package server.rem.mappers;

import java.util.Collections;
import java.util.List;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;

import server.rem.dtos.tasks.CreateTaskRequest;
import server.rem.dtos.tasks.TaskAttachmentResponse;
import server.rem.dtos.tasks.TaskBoardResponse;
import server.rem.dtos.tasks.TaskCommentAttachmentResponse;
import server.rem.dtos.tasks.TaskCommentResponse;
import server.rem.dtos.tasks.TaskDetailResponse;
import server.rem.dtos.tasks.TaskHistoryResponse;
import server.rem.dtos.tasks.TaskLabelResponse;
import server.rem.dtos.tasks.TaskReferenceResponse;
import server.rem.dtos.tasks.TaskResponse;
import server.rem.dtos.tasks.TaskUserResponse;
import server.rem.dtos.tasks.UpdateTaskRequest;
import server.rem.entities.Business;
import server.rem.entities.Task;
import server.rem.entities.TaskAttachment;
import server.rem.entities.TaskComment;
import server.rem.entities.TaskCommentAttachment;
import server.rem.entities.TaskHistory;
import server.rem.entities.TaskLabel;
import server.rem.entities.User;
import server.rem.enums.TaskHistoryAction;
import server.rem.enums.TaskHistoryType;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface TaskMapper {
    @Mapping(target = "business", source = "business")
    @Mapping(target = "assignee", source = "assignee")
    @Mapping(target = "subTask", source = "subTask")
    @Mapping(target = "title", source = "dto.title", qualifiedByName = "trim")
    @Mapping(target = "priority", source = "dto.priority")
    @Mapping(target = "status", source = "dto.status")
    @Mapping(target = "startDate", source = "dto.startDate")
    @Mapping(target = "dueDate", source = "dto.dueDate")
    @Mapping(target = "description", source = "dto.description")
    @Mapping(target = "labels", ignore = true)
    @Mapping(target = "attachments", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "histories", ignore = true)
    Task toEntity(CreateTaskRequest dto, Business business, User assignee, Task subTask);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "business", ignore = true)
    @Mapping(target = "assignee", ignore = true)
    @Mapping(target = "subTask", ignore = true)
    @Mapping(target = "title", source = "title", qualifiedByName = "trim")
    @Mapping(target = "labels", ignore = true)
    @Mapping(target = "attachments", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "histories", ignore = true)
    void updateEntity(UpdateTaskRequest dto, @MappingTarget Task task);

    @Mapping(target = "businessId", source = "business.id")
    @Mapping(target = "labels", ignore = true)
    @Mapping(target = "attachments", ignore = true)
    TaskResponse toTaskResponse(Task task);

    TaskBoardResponse toTaskBoardResponse(Task task);

    @Mapping(target = "id", source = "task.id")
    @Mapping(target = "businessId", source = "task.business.id")
    @Mapping(target = "assignee", source = "task.assignee")
    @Mapping(target = "subTask", source = "task.subTask")
    @Mapping(target = "title", source = "task.title")
    @Mapping(target = "priority", source = "task.priority")
    @Mapping(target = "status", source = "task.status")
    @Mapping(target = "startDate", source = "task.startDate")
    @Mapping(target = "dueDate", source = "task.dueDate")
    @Mapping(target = "description", source = "task.description")
    @Mapping(target = "labels", source = "task.labels")
    @Mapping(target = "attachments", source = "task.attachments")
    @Mapping(target = "createdAt", source = "task.createdAt")
    @Mapping(target = "updatedAt", source = "task.updatedAt")
    @Mapping(target = "comments", source = "comments")
    @Mapping(target = "histories", source = "histories")
    TaskDetailResponse toTaskDetailResponse(
            Task task,
            List<TaskCommentResponse> comments,
            List<TaskHistoryResponse> histories);

    TaskUserResponse toTaskUserResponse(User user);

    TaskReferenceResponse toTaskReferenceResponse(Task task);

    TaskLabelResponse toTaskLabelResponse(TaskLabel label);

    TaskAttachmentResponse toTaskAttachmentResponse(TaskAttachment attachment);

    TaskCommentAttachmentResponse toTaskCommentAttachmentResponse(TaskCommentAttachment attachment);

    @Mapping(target = "id", source = "comment.id")
    @Mapping(target = "content", source = "comment.content")
    @Mapping(target = "user", source = "comment.user")
    @Mapping(target = "attachment", source = "attachment")
    @Mapping(target = "createdAt", source = "comment.createdAt")
    @Mapping(target = "updatedAt", source = "comment.updatedAt")
    TaskCommentResponse toTaskCommentResponse(TaskComment comment, TaskCommentAttachment attachment);

    TaskHistoryResponse toTaskHistoryResponse(TaskHistory history);

    @Mapping(target = "title", source = "title")
    @Mapping(target = "url", source = "url")
    @Mapping(target = "task", source = "task")
    TaskAttachment toTaskAttachment(String title, String url, Task task);

    @Mapping(target = "content", source = "content")
    @Mapping(target = "task", source = "task")
    @Mapping(target = "user", source = "user")
    TaskComment toTaskComment(String content, Task task, User user);

    @Mapping(target = "title", source = "title")
    @Mapping(target = "taskComment", source = "comment")
    TaskCommentAttachment toTaskCommentAttachment(String title, TaskComment comment);

    @Mapping(target = "title", source = "title")
    @Mapping(target = "task", source = "task")
    TaskLabel toTaskLabel(String title, Task task);

    @Mapping(target = "title", source = "title")
    @Mapping(target = "task", source = "task")
    @Mapping(target = "user", source = "user")
    @Mapping(target = "fromDescription", source = "fromDescription")
    @Mapping(target = "toDescription", source = "toDescription")
    @Mapping(target = "type", source = "type")
    @Mapping(target = "action", source = "action")
    TaskHistory toTaskHistory(
            String title,
            Task task,
            User user,
            String fromDescription,
            String toDescription,
            TaskHistoryType type,
            TaskHistoryAction action);

    @AfterMapping
    default void initializeCollections(@MappingTarget TaskResponse response) {
        if (response.getLabels() == null) response.setLabels(Collections.emptyList());
        if (response.getAttachments() == null) response.setAttachments(Collections.emptyList());
    }

    @Named("trim")
    default String trim(String value) {
        return value == null ? null : value.trim();
    }
}
