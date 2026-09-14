package server.rem.services;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import server.rem.dtos.CustomPageResponse;
import server.rem.dtos.tasks.CreateTaskCommentRequest;
import server.rem.dtos.tasks.CreateTaskLabelRequest;
import server.rem.dtos.tasks.CreateTaskRequest;
import server.rem.dtos.tasks.QueryTask;
import server.rem.dtos.tasks.TaskAttachmentResponse;
import server.rem.dtos.tasks.TaskBoardResponse;
import server.rem.dtos.tasks.TaskCommentResponse;
import server.rem.dtos.tasks.TaskDetailResponse;
import server.rem.dtos.tasks.TaskHistoryResponse;
import server.rem.dtos.tasks.TaskLabelResponse;
import server.rem.dtos.tasks.TaskResponse;
import server.rem.dtos.tasks.UpdateTaskRequest;
import server.rem.entities.Business;
import server.rem.entities.Task;
import server.rem.entities.TaskAttachment;
import server.rem.entities.TaskComment;
import server.rem.entities.TaskCommentAttachment;
import server.rem.entities.TaskLabel;
import server.rem.entities.User;
import server.rem.enums.TaskHistoryAction;
import server.rem.enums.TaskHistoryType;
import server.rem.enums.TaskPriority;
import server.rem.enums.TaskStatus;
import server.rem.mappers.TaskMapper;
import server.rem.repositories.BusinessRepository;
import server.rem.repositories.BusinessUserRepository;
import server.rem.repositories.TaskAttachmentRepository;
import server.rem.repositories.TaskCommentAttachmentRepository;
import server.rem.repositories.TaskCommentRepository;
import server.rem.repositories.TaskHistoryRepository;
import server.rem.repositories.TaskLabelRepository;
import server.rem.repositories.TaskRepository;
import server.rem.repositories.UserRepository;
import server.rem.specifications.TaskSpecification;
import server.rem.utils.exceptions.ConflictException;
import server.rem.utils.exceptions.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
public class TaskService {

    private static final int MAX_DESCRIPTION_LENGTH = 255;
    private final TaskRepository taskRepository;
    private final TaskAttachmentRepository taskAttachmentRepository;
    private final TaskCommentRepository taskCommentRepository;
    private final TaskCommentAttachmentRepository taskCommentAttachmentRepository;
    private final TaskLabelRepository taskLabelRepository;
    private final TaskHistoryRepository taskHistoryRepository;
    private final BusinessRepository businessRepository;
    private final BusinessUserRepository businessUserRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;
    private final TaskMapper taskMapper;

    @Transactional
    public TaskResponse create(CreateTaskRequest dto, String businessId, String userId) {
        validateDates(dto.getStartDate(), dto.getDueDate());
        Business business = businessRepository.findById(businessId).orElseThrow(() -> new ResourceNotFoundException("Business not found"));
        User assignee = getActiveBusinessUser(dto.getAssigneeId(), businessId);
        Task subTask = resolveSubTask(dto.getSubTaskId(), businessId, null);
        User user = getUser(userId);
        Task task = taskRepository.save(taskMapper.toEntity(dto, business, assignee, subTask));
        addHistory(task, user, "Task created", null, task.getTitle(), TaskHistoryType.DESCRIPTION, TaskHistoryAction.CREATE);
        return taskMapper.toTaskResponse(task);
    }

    @Transactional(readOnly = true)
    public CustomPageResponse<TaskResponse> getAll(QueryTask dto, String businessId) {
        Pageable pageable = PageRequest.of(
                dto.getPage(),
                dto.getPageSize(),
                Sort.by(Sort.Direction.DESC, "createdAt"));
        Specification<Task> spec = TaskSpecification.withFilters(dto, businessId);
        Page<TaskResponse> result = taskRepository.findAll(spec, pageable).map(taskMapper::toTaskResponse);
        return new CustomPageResponse<TaskResponse>(result);
    }

    @Transactional(readOnly = true)
    public List<TaskBoardResponse> getBoard(String businessId) {
        return taskRepository.findAllByBusiness_IdOrderByCreatedAtDesc(businessId)
                .stream()
                .map(taskMapper::toTaskBoardResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TaskDetailResponse getOne(String id, String businessId) {
        Task task = getTask(id, businessId);
        List<TaskComment> comments = taskCommentRepository.findByTask_IdOrderByCreatedAtAsc(id);
        Map<String, TaskCommentAttachment> attachmentsByCommentId = taskCommentAttachmentRepository
                .findByTaskComment_Task_Id(id)
                .stream()
                .collect(Collectors.toMap(
                        attachment -> attachment.getTaskComment().getId(),
                        Function.identity(),
                        (first, ignored) -> first));
        List<TaskCommentResponse> commentResponses = comments.stream()
                .map(comment -> taskMapper.toTaskCommentResponse(comment, attachmentsByCommentId.get(comment.getId())))
                .toList();
        List<TaskHistoryResponse> historyResponses = taskHistoryRepository.findByTask_IdOrderByCreatedAtDesc(id)
                .stream()
                .map(taskMapper::toTaskHistoryResponse)
                .toList();
        return taskMapper.toTaskDetailResponse(task, commentResponses, historyResponses);
    }

    @Transactional
    public TaskResponse update(String id, UpdateTaskRequest dto, String businessId, String userId) {
        Task task = getTask(id, businessId);
        User user = getUser(userId);
        String oldTitle = task.getTitle();
        TaskPriority oldPriority = task.getPriority();
        TaskStatus oldStatus = task.getStatus();
        Instant oldStartDate = task.getStartDate();
        Instant oldDueDate = task.getDueDate();
        String oldDescription = task.getDescription();
        String oldAssignee = userDescription(task.getAssignee());
        String oldSubTask = taskDescription(task.getSubTask());

        Instant startDate = dto.getStartDate() == null ? task.getStartDate() : dto.getStartDate();
        Instant dueDate = dto.getDueDate() == null ? task.getDueDate() : dto.getDueDate();
        validateDates(startDate, dueDate);

        taskMapper.updateEntity(dto, task);
        if (dto.getAssigneeId() != null) {
            if (!StringUtils.hasText(dto.getAssigneeId())) {
                throw new IllegalArgumentException("Assignee ID is required");
            }
            task.setAssignee(getActiveBusinessUser(dto.getAssigneeId(), businessId));
        }
        if (dto.getSubTaskId() != null) {
            task.setSubTask(resolveSubTask(dto.getSubTaskId(), businessId, id));
        }

        taskRepository.save(task);
        boolean historyAdded = addUpdateHistories(
                task,
                user,
                oldTitle,
                oldPriority,
                oldStatus,
                oldStartDate,
                oldDueDate,
                oldDescription,
                oldAssignee,
                oldSubTask);
        if (!historyAdded) {
            addHistory(
                    task,
                    user,
                    "Task updated",
                    null,
                    null,
                    TaskHistoryType.DESCRIPTION,
                    TaskHistoryAction.UPDATE);
        }
        return taskMapper.toTaskResponse(task);
    }

    @Transactional(rollbackFor = Exception.class)
    public TaskAttachmentResponse createAttachment(
            String taskId,
            MultipartFile file,
            String businessId,
            String userId) throws Exception {
        Task task = getTask(taskId, businessId);
        User user = getUser(userId);
        String filename = extractOriginalFilename(file);
        String url = cloudinaryService.uploadFile(file, "/tasks/" + taskId + "/attachments", null);
        TaskAttachment attachment = taskAttachmentRepository.save(
                taskMapper.toTaskAttachment(filename, url, task));
        addHistory(
                task,
                user,
                "Attachment added",
                null,
                filename,
                TaskHistoryType.ATTACHMENT,
                TaskHistoryAction.CREATE);
        return taskMapper.toTaskAttachmentResponse(attachment);
    }

    @Transactional(rollbackFor = Exception.class)
    public void deleteAttachment(String attachmentId, String businessId, String userId) throws Exception {
        TaskAttachment attachment = taskAttachmentRepository
                .findByIdAndTask_Business_Id(attachmentId, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Task attachment not found"));
        User user = getUser(userId);
        addHistory(
                attachment.getTask(),
                user,
                "Attachment deleted",
                attachment.getTitle(),
                null,
                TaskHistoryType.ATTACHMENT,
                TaskHistoryAction.DELETE);
        taskAttachmentRepository.delete(attachment);
        taskAttachmentRepository.flush();
        if (StringUtils.hasText(attachment.getUrl())) {
            cloudinaryService.deleteFile(attachment.getUrl());
        }
    }

    @Transactional
    public TaskCommentResponse createComment(
            String taskId,
            CreateTaskCommentRequest dto,
            MultipartFile attachmentFile,
            String businessId,
            String userId) {
        Task task = getTask(taskId, businessId);
        User user = getUser(userId);
        TaskComment comment = taskCommentRepository.save(
                taskMapper.toTaskComment(dto.getContent().trim(), task, user));
        TaskCommentAttachment attachment = null;
        if (attachmentFile != null) {
            String filename = extractOriginalFilename(attachmentFile);
            attachment = taskCommentAttachmentRepository.save(
                    taskMapper.toTaskCommentAttachment(filename, comment));
        }
        addHistory(
                task,
                user,
                "Comment added",
                null,
                attachment == null ? comment.getContent() : attachment.getTitle(),
                TaskHistoryType.DESCRIPTION,
                TaskHistoryAction.CREATE);
        return taskMapper.toTaskCommentResponse(comment, attachment);
    }

    @Transactional
    public void deleteComment(String commentId, String businessId, String userId) {
        TaskComment comment = taskCommentRepository.findByIdAndTask_Business_Id(commentId, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Task comment not found"));
        User user = getUser(userId);
        List<TaskCommentAttachment> attachments = taskCommentAttachmentRepository.findByTaskComment_Id(commentId);
        String description = attachments.isEmpty() ? comment.getContent() : attachments.getFirst().getTitle();
        addHistory(
                comment.getTask(),
                user,
                "Comment deleted",
                description,
                null,
                TaskHistoryType.DESCRIPTION,
                TaskHistoryAction.DELETE);
        taskCommentAttachmentRepository.deleteAll(attachments);
        taskCommentRepository.delete(comment);
    }

    @Transactional
    public TaskLabelResponse createLabel(
            String taskId,
            CreateTaskLabelRequest dto,
            String businessId,
            String userId) {
        Task task = getTask(taskId, businessId);
        User user = getUser(userId);
        String title = dto.getTitle().trim();
        if (taskLabelRepository.existsByTask_IdAndTitleIgnoreCase(taskId, title)) {
            throw new ConflictException("Task label already exists");
        }
        TaskLabel label = taskLabelRepository.save(taskMapper.toTaskLabel(title, task));
        addHistory(
                task,
                user,
                "Label added",
                null,
                title,
                TaskHistoryType.LABEL,
                TaskHistoryAction.CREATE);
        return taskMapper.toTaskLabelResponse(label);
    }

    @Transactional
    public void deleteLabel(String labelId, String businessId, String userId) {
        TaskLabel label = taskLabelRepository.findByIdAndTask_Business_Id(labelId, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Task label not found"));
        User user = getUser(userId);
        addHistory(
                label.getTask(),
                user,
                "Label deleted",
                label.getTitle(),
                null,
                TaskHistoryType.LABEL,
                TaskHistoryAction.DELETE);
        taskLabelRepository.delete(label);
    }

    private boolean addUpdateHistories(
            Task task,
            User user,
            String oldTitle,
            TaskPriority oldPriority,
            TaskStatus oldStatus,
            Instant oldStartDate,
            Instant oldDueDate,
            String oldDescription,
            String oldAssignee,
            String oldSubTask) {
        boolean added = false;
        added |= addUpdateHistory(task, user, "Task title updated", oldTitle, task.getTitle(), TaskHistoryType.DESCRIPTION);
        added |= addUpdateHistory(task, user, "Task priority updated", oldPriority, task.getPriority(), TaskHistoryType.DESCRIPTION);
        added |= addUpdateHistory(task, user, "Task status updated", oldStatus, task.getStatus(), TaskHistoryType.STATUS);
        added |= addUpdateHistory(task, user, "Task start date updated", oldStartDate, task.getStartDate(), TaskHistoryType.DATE);
        added |= addUpdateHistory(task, user, "Task due date updated", oldDueDate, task.getDueDate(), TaskHistoryType.DATE);
        added |= addUpdateHistory(task, user, "Task description updated", oldDescription, task.getDescription(), TaskHistoryType.DESCRIPTION);
        added |= addUpdateHistory(task, user, "Task assignee updated", oldAssignee, userDescription(task.getAssignee()), TaskHistoryType.ASSIGNEE);
        added |= addUpdateHistory(task, user, "Sub-task updated", oldSubTask, taskDescription(task.getSubTask()), TaskHistoryType.DESCRIPTION);
        return added;
    }

    private boolean addUpdateHistory(
            Task task,
            User user,
            String title,
            Object fromDescription,
            Object toDescription,
            TaskHistoryType type) {
        if (Objects.equals(fromDescription, toDescription)) {
            return false;
        }
        addHistory(task, user, title, fromDescription, toDescription, type, TaskHistoryAction.UPDATE);
        return true;
    }

    private void addHistory(
            Task task,
            User user,
            String title,
            Object fromDescription,
            Object toDescription,
            TaskHistoryType type,
            TaskHistoryAction action) {
        taskHistoryRepository.save(taskMapper.toTaskHistory(
                title,
                task,
                user,
                toHistoryDescription(fromDescription),
                toHistoryDescription(toDescription),
                type,
                action));
    }

    private Task getTask(String id, String businessId) {
        return taskRepository.findByIdAndBusiness_Id(id, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
    }

    private User getUser(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private User getActiveBusinessUser(String userId, String businessId) {
        return businessUserRepository.findActiveByUserIdAndBusinessId(userId, businessId)
                .map(membership -> membership.getUser())
                .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
    }

    private Task resolveSubTask(String subTaskId, String businessId, String currentTaskId) {
        if (!StringUtils.hasText(subTaskId)) {
            return null;
        }
        if (subTaskId.equals(currentTaskId)) {
            throw new IllegalArgumentException("A task cannot reference itself as a sub-task");
        }
        return getTask(subTaskId, businessId);
    }

    private String extractOriginalFilename(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Attachment file is required");
        }
        String path = StringUtils.cleanPath(Objects.requireNonNullElse(file.getOriginalFilename(), ""));
        String filename = path.substring(path.lastIndexOf('/') + 1);
        if (!StringUtils.hasText(filename) || filename.equals(".") || filename.equals("..")) {
            throw new IllegalArgumentException("Attachment filename is invalid");
        }
        if (filename.length() > MAX_DESCRIPTION_LENGTH) {
            throw new IllegalArgumentException("Attachment filename must not exceed 255 characters");
        }
        return filename;
    }

    private String toHistoryDescription(Object value) {
        if (value == null) {
            return null;
        }
        String description = value.toString();
        int codePointCount = description.codePointCount(0, description.length());
        if (codePointCount <= MAX_DESCRIPTION_LENGTH) {
            return description;
        }
        return description.substring(0, description.offsetByCodePoints(0, MAX_DESCRIPTION_LENGTH));
    }

    private String userDescription(User user) {
        if (user == null) {
            return null;
        }
        return StringUtils.hasText(user.getFullname()) ? user.getFullname() : user.getId();
    }

    private String taskDescription(Task task) {
        if (task == null) {
            return null;
        }
        return StringUtils.hasText(task.getTitle()) ? task.getTitle() : task.getId();
    }

    private void validateDates(Instant startDate, Instant dueDate) {
        if (startDate != null && dueDate != null && dueDate.isBefore(startDate)) {
            throw new IllegalArgumentException("Due date must not be before start date");
        }
    }
}
