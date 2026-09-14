package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import server.rem.dtos.tasks.CreateTaskCommentRequest;
import server.rem.dtos.tasks.CreateTaskRequest;
import server.rem.dtos.tasks.TaskAttachmentResponse;
import server.rem.dtos.tasks.TaskBoardResponse;
import server.rem.dtos.tasks.TaskCommentResponse;
import server.rem.dtos.tasks.TaskResponse;
import server.rem.dtos.tasks.UpdateTaskRequest;
import server.rem.entities.Business;
import server.rem.entities.BusinessUser;
import server.rem.entities.Task;
import server.rem.entities.TaskAttachment;
import server.rem.entities.TaskComment;
import server.rem.entities.TaskCommentAttachment;
import server.rem.entities.TaskHistory;
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

@ExtendWith(MockitoExtension.class)
class TaskServiceTests {
    @Mock
    private TaskRepository taskRepository;
    @Mock
    private TaskAttachmentRepository taskAttachmentRepository;
    @Mock
    private TaskCommentRepository taskCommentRepository;
    @Mock
    private TaskCommentAttachmentRepository taskCommentAttachmentRepository;
    @Mock
    private TaskLabelRepository taskLabelRepository;
    @Mock
    private TaskHistoryRepository taskHistoryRepository;
    @Mock
    private BusinessRepository businessRepository;
    @Mock
    private BusinessUserRepository businessUserRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private CloudinaryService cloudinaryService;

    private TaskService taskService;

    @BeforeEach
    void setUp() {
        taskService = new TaskService(
                taskRepository,
                taskAttachmentRepository,
                taskCommentRepository,
                taskCommentAttachmentRepository,
                taskLabelRepository,
                taskHistoryRepository,
                businessRepository,
                businessUserRepository,
                userRepository,
                cloudinaryService,
                Mappers.getMapper(TaskMapper.class));
    }

    @Test
    void createPersistsTaskAndCreateHistory() {
        Business business = business("business-1");
        User assignee = user("assignee-1", "Assignee");
        User creator = user("user-1", "Creator");
        CreateTaskRequest request = new CreateTaskRequest(
                "assignee-1",
                null,
                "  Prepare report  ",
                TaskPriority.HIGH,
                TaskStatus.IN_PROGRESS,
                null,
                null,
                "Prepare the monthly report");

        when(businessRepository.findById("business-1")).thenReturn(Optional.of(business));
        when(businessUserRepository.findActiveByUserIdAndBusinessId("assignee-1", "business-1"))
                .thenReturn(Optional.of(membership(business, assignee)));
        when(userRepository.findById("user-1")).thenReturn(Optional.of(creator));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> {
            Task task = invocation.getArgument(0);
            task.setId("task-1");
            return task;
        });

        TaskResponse response = taskService.create(request, "business-1", "user-1");

        ArgumentCaptor<Task> taskCaptor = ArgumentCaptor.forClass(Task.class);
        ArgumentCaptor<TaskHistory> historyCaptor = ArgumentCaptor.forClass(TaskHistory.class);
        verify(taskRepository).save(taskCaptor.capture());
        verify(taskHistoryRepository).save(historyCaptor.capture());
        assertSame(business, taskCaptor.getValue().getBusiness());
        assertSame(assignee, taskCaptor.getValue().getAssignee());
        assertEquals("Prepare report", taskCaptor.getValue().getTitle());
        assertEquals("task-1", response.getId());
        assertEquals(TaskHistoryAction.CREATE, historyCaptor.getValue().getAction());
        assertEquals(TaskHistoryType.DESCRIPTION, historyCaptor.getValue().getType());
        assertEquals("Prepare report", historyCaptor.getValue().getToDescription());
    }

    @Test
    void updateCreatesFieldSpecificHistoryRecords() {
        Business business = business("business-1");
        User oldAssignee = user("assignee-1", "Old Assignee");
        User newAssignee = user("assignee-2", "New Assignee");
        User editor = user("user-1", "Editor");
        Task task = task("task-1", business, oldAssignee);
        task.setStatus(TaskStatus.IN_PROGRESS);
        UpdateTaskRequest request = new UpdateTaskRequest();
        request.setAssigneeId("assignee-2");
        request.setStatus(TaskStatus.TESTING);

        when(taskRepository.findByIdAndBusiness_Id("task-1", "business-1")).thenReturn(Optional.of(task));
        when(userRepository.findById("user-1")).thenReturn(Optional.of(editor));
        when(businessUserRepository.findActiveByUserIdAndBusinessId("assignee-2", "business-1"))
                .thenReturn(Optional.of(membership(business, newAssignee)));
        when(taskRepository.save(task)).thenReturn(task);

        taskService.update("task-1", request, "business-1", "user-1");

        ArgumentCaptor<TaskHistory> historyCaptor = ArgumentCaptor.forClass(TaskHistory.class);
        verify(taskHistoryRepository, org.mockito.Mockito.times(2)).save(historyCaptor.capture());
        List<TaskHistory> histories = historyCaptor.getAllValues();
        assertEquals(TaskHistoryType.STATUS, histories.get(0).getType());
        assertEquals("IN_PROGRESS", histories.get(0).getFromDescription());
        assertEquals("TESTING", histories.get(0).getToDescription());
        assertEquals(TaskHistoryType.ASSIGNEE, histories.get(1).getType());
        assertEquals("Old Assignee", histories.get(1).getFromDescription());
        assertEquals("New Assignee", histories.get(1).getToDescription());
    }

    @Test
    void getBoardReturnsTasksForBusiness() {
        Business business = business("business-1");
        User assignee = user("assignee-1", "Assignee");
        Task task = task("task-1", business, assignee);
        task.setStatus(TaskStatus.IN_PROGRESS);

        when(taskRepository.findAllByBusiness_IdOrderByCreatedAtDesc("business-1"))
                .thenReturn(List.of(task));

        List<TaskBoardResponse> response = taskService.getBoard("business-1");

        assertEquals(1, response.size());
        assertEquals("task-1", response.get(0).id());
        assertEquals(TaskStatus.IN_PROGRESS, response.get(0).status());
        assertEquals("Assignee", response.get(0).assignee().fullname());
        verify(taskRepository).findAllByBusiness_IdOrderByCreatedAtDesc("business-1");
    }

    @Test
    void attachmentUsesOnlyOriginalFilenameBasename() throws Exception {
        Business business = business("business-1");
        User assignee = user("assignee-1", "Assignee");
        User creator = user("user-1", "Creator");
        Task task = task("task-1", business, assignee);
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "C:\\fakepath\\quarterly-report.pdf",
                "application/pdf",
                "content".getBytes());

        when(taskRepository.findByIdAndBusiness_Id("task-1", "business-1")).thenReturn(Optional.of(task));
        when(userRepository.findById("user-1")).thenReturn(Optional.of(creator));
        when(cloudinaryService.uploadFile(file, "/tasks/task-1/attachments", null))
                .thenReturn("https://cdn.example.com/quarterly-report.pdf");
        when(taskAttachmentRepository.save(any(TaskAttachment.class))).thenAnswer(invocation -> {
            TaskAttachment attachment = invocation.getArgument(0);
            attachment.setId("attachment-1");
            return attachment;
        });

        TaskAttachmentResponse response = taskService.createAttachment(
                "task-1",
                file,
                "business-1",
                "user-1");

        ArgumentCaptor<TaskHistory> historyCaptor = ArgumentCaptor.forClass(TaskHistory.class);
        verify(taskHistoryRepository).save(historyCaptor.capture());
        assertEquals("quarterly-report.pdf", response.title());
        assertEquals("quarterly-report.pdf", historyCaptor.getValue().getToDescription());
        assertEquals(TaskHistoryType.ATTACHMENT, historyCaptor.getValue().getType());
    }

    @Test
    void commentAttachmentStoresFilenameAndUsesItInHistory() {
        Business business = business("business-1");
        User user = user("user-1", "Creator");
        Task task = task("task-1", business, user);
        MockMultipartFile file = new MockMultipartFile(
                "attachment",
                "../evidence.png",
                "image/png",
                "content".getBytes());

        when(taskRepository.findByIdAndBusiness_Id("task-1", "business-1")).thenReturn(Optional.of(task));
        when(userRepository.findById("user-1")).thenReturn(Optional.of(user));
        when(taskCommentRepository.save(any(TaskComment.class))).thenAnswer(invocation -> {
            TaskComment comment = invocation.getArgument(0);
            comment.setId("comment-1");
            return comment;
        });
        when(taskCommentAttachmentRepository.save(any(TaskCommentAttachment.class))).thenAnswer(invocation -> {
            TaskCommentAttachment attachment = invocation.getArgument(0);
            attachment.setId("comment-attachment-1");
            return attachment;
        });

        TaskCommentResponse response = taskService.createComment(
                "task-1",
                new CreateTaskCommentRequest("Looks correct"),
                file,
                "business-1",
                "user-1");

        ArgumentCaptor<TaskHistory> historyCaptor = ArgumentCaptor.forClass(TaskHistory.class);
        verify(taskHistoryRepository).save(historyCaptor.capture());
        assertEquals("evidence.png", response.attachment().title());
        assertEquals("evidence.png", historyCaptor.getValue().getToDescription());
        assertEquals(TaskHistoryAction.CREATE, historyCaptor.getValue().getAction());
    }

    private static Business business(String id) {
        Business business = Business.builder().name("REM").build();
        business.setId(id);
        return business;
    }

    private static User user(String id, String fullname) {
        User user = User.builder().fullname(fullname).email(id + "@example.com").build();
        user.setId(id);
        return user;
    }

    private static BusinessUser membership(Business business, User user) {
        return BusinessUser.builder().business(business).user(user).isActive(true).build();
    }

    private static Task task(String id, Business business, User assignee) {
        Task task = Task.builder()
                .business(business)
                .assignee(assignee)
                .title("Task")
                .priority(TaskPriority.MEDIUM)
                .build();
        task.setId(id);
        return task;
    }
}
