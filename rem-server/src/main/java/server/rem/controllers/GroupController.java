package server.rem.controllers;

import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import server.rem.annotations.RequestUser;
import server.rem.dtos.APIResponse;
import server.rem.dtos.group.AddUsersToGroupRequest;
import server.rem.dtos.group.CreateGroupRequest;
import server.rem.dtos.group.GroupResponse;
import server.rem.services.GroupService;

@RestController
@RequestMapping("/group")
@RequiredArgsConstructor
public class GroupController {
    private final GroupService groupService;

    @GetMapping
    public ResponseEntity<APIResponse<List<GroupResponse>>> getAll(
            @RequestUser String userId,
            @RequestAttribute("businessId") String businessId) {
        return ResponseEntity.ok(APIResponse.success(
                200,
                "Groups retrieved successfully",
                groupService.getAll(userId, businessId)));
    }

    @PostMapping
    public ResponseEntity<APIResponse<GroupResponse>> create(
            @RequestUser String userId,
            @RequestAttribute("businessId") String businessId,
            @Valid @RequestBody CreateGroupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(APIResponse.success(
                201,
                "Group created successfully",
                groupService.create(userId, businessId, request)));
    }

    @PostMapping("/add-user")
    public ResponseEntity<APIResponse<GroupResponse>> addUsers(
            @RequestUser String userId,
            @RequestAttribute("businessId") String businessId,
            @Valid @RequestBody AddUsersToGroupRequest request) {
        return ResponseEntity.ok(APIResponse.success(
                200,
                "Users added to group successfully",
                groupService.addUsers(userId, businessId, request)));
    }
}
