package server.rem.controllers;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import server.rem.annotations.RequestUser;
import server.rem.dtos.APIResponse;
import server.rem.dtos.CustomPageResponse;
import server.rem.dtos.tasks.CreateTaskCommentRequest;
import server.rem.dtos.tasks.CreateTaskLabelRequest;
import server.rem.dtos.tasks.CreateTaskRequest;
import server.rem.dtos.tasks.QueryTask;
import server.rem.dtos.tasks.TaskAttachmentResponse;
import server.rem.dtos.tasks.TaskBoardResponse;
import server.rem.dtos.tasks.TaskCommentResponse;
import server.rem.dtos.tasks.TaskDetailResponse;
import server.rem.dtos.tasks.TaskLabelResponse;
import server.rem.dtos.tasks.TaskResponse;
import server.rem.dtos.tasks.UpdateTaskRequest;
import server.rem.services.TaskService;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<APIResponse<TaskResponse>> create(
            @Valid @RequestBody CreateTaskRequest dto,
            @RequestAttribute("businessId") String businessId,
            @RequestUser String userId) {
        return ResponseEntity.ok(APIResponse.success(
                201,
                "Task created",
                taskService.create(dto, businessId, userId)));
    }

    @GetMapping
    public ResponseEntity<APIResponse<CustomPageResponse<TaskResponse>>> getAll(
            @ModelAttribute QueryTask dto,
            @RequestAttribute("businessId") String businessId) {
        return ResponseEntity.ok(APIResponse.success(
                200,
                "Tasks fetched",
                taskService.getAll(dto, businessId)));
    }

    @GetMapping("/board")
    public ResponseEntity<APIResponse<List<TaskBoardResponse>>> getBoard(
            @RequestAttribute("businessId") String businessId) {
        return ResponseEntity.ok(APIResponse.success(
                200,
                "Task board fetched",
                taskService.getBoard(businessId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<TaskDetailResponse>> getOne(
            @PathVariable String id,
            @RequestAttribute("businessId") String businessId) {
        return ResponseEntity.ok(APIResponse.success(
                200,
                "Task fetched",
                taskService.getOne(id, businessId)));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<APIResponse<TaskResponse>> update(
            @PathVariable String id,
            @Valid @RequestBody UpdateTaskRequest dto,
            @RequestAttribute("businessId") String businessId,
            @RequestUser String userId) {
        return ResponseEntity.ok(APIResponse.success(
                200,
                "Task updated",
                taskService.update(id, dto, businessId, userId)));
    }

    @PostMapping(value = "/attachments/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<APIResponse<TaskAttachmentResponse>> createAttachment(
            @PathVariable String id,
            @RequestPart("file") MultipartFile file,
            @RequestAttribute("businessId") String businessId,
            @RequestUser String userId) throws Exception {
        return ResponseEntity.ok(APIResponse.success(
                201,
                "Task attachment created",
                taskService.createAttachment(id, file, businessId, userId)));
    }

    @DeleteMapping("/attachments/{id}")
    public ResponseEntity<APIResponse<Void>> deleteAttachment(
            @PathVariable String id,
            @RequestAttribute("businessId") String businessId,
            @RequestUser String userId) throws Exception {
        taskService.deleteAttachment(id, businessId, userId);
        return ResponseEntity.ok(APIResponse.success(200, "Task attachment deleted", null));
    }

    @PostMapping(value = "/comments/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<APIResponse<TaskCommentResponse>> createComment(
            @PathVariable String id,
            @Valid @RequestBody CreateTaskCommentRequest dto,
            @RequestAttribute("businessId") String businessId,
            @RequestUser String userId) {
        return ResponseEntity.ok(APIResponse.success(
                201,
                "Task comment created",
                taskService.createComment(id, dto, null, businessId, userId)));
    }

    @PostMapping(value = "/comments/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<APIResponse<TaskCommentResponse>> createCommentWithAttachment(
            @PathVariable String id,
            @Valid @RequestPart("comment") CreateTaskCommentRequest dto,
            @RequestPart(value = "attachment", required = false) MultipartFile attachment,
            @RequestAttribute("businessId") String businessId,
            @RequestUser String userId) {
        return ResponseEntity.ok(APIResponse.success(
                201,
                "Task comment created",
                taskService.createComment(id, dto, attachment, businessId, userId)));
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<APIResponse<Void>> deleteComment(
            @PathVariable String id,
            @RequestAttribute("businessId") String businessId,
            @RequestUser String userId) {
        taskService.deleteComment(id, businessId, userId);
        return ResponseEntity.ok(APIResponse.success(200, "Task comment deleted", null));
    }

    @PostMapping("/labels/{id}")
    public ResponseEntity<APIResponse<TaskLabelResponse>> createLabel(
            @PathVariable String id,
            @Valid @RequestBody CreateTaskLabelRequest dto,
            @RequestAttribute("businessId") String businessId,
            @RequestUser String userId) {
        return ResponseEntity.ok(APIResponse.success(
                201,
                "Task label created",
                taskService.createLabel(id, dto, businessId, userId)));
    }

    @DeleteMapping("/labels/{id}")
    public ResponseEntity<APIResponse<Void>> deleteLabel(
            @PathVariable String id,
            @RequestAttribute("businessId") String businessId,
            @RequestUser String userId) {
        taskService.deleteLabel(id, businessId, userId);
        return ResponseEntity.ok(APIResponse.success(200, "Task label deleted", null));
    }
}
