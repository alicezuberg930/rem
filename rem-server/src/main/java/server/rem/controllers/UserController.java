package server.rem.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import server.rem.annotations.RequestUser;
import server.rem.dtos.APIResponse;
import server.rem.dtos.user.CreateUserRequest;
import server.rem.dtos.user.CreateUserResponse;
import server.rem.dtos.user.UpdateUserRequest;
import server.rem.dtos.user.UserRoleResponse;
import server.rem.entities.User;
import server.rem.repositories.UserRepository;
import server.rem.services.UserService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {
    private final UserRepository userRepository;
    private final UserService userService;

    @PostMapping
    @PreAuthorize("hasAuthority('user.create')")
    public ResponseEntity<APIResponse<CreateUserResponse>> createUser(
            @RequestUser String invitorId,
            @RequestAttribute("businessId") String businessId,
            @Valid @RequestBody CreateUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(APIResponse.success(
                HttpStatus.CREATED.value(),
                "User created successfully",
                userService.createUser(invitorId, businessId, request)));
    }

    @GetMapping("/get")
    public ResponseEntity<APIResponse<?>> getUsers(
            @RequestUser String userId,
            @RequestAttribute("businessId") String businessId,
            @RequestParam(defaultValue = "false") boolean isChat) {
        if (!isChat) {
            return ResponseEntity.ok(APIResponse.success(
                    HttpStatus.OK.value(),
                    "User list retrieved successfully",
                    userService.getBusinessUsers(userId, businessId)));
        }
        return ResponseEntity.ok().body(APIResponse.success(
                200,
                "User list retrieved successfully",
                userService.getChatUsers(userId, businessId)));
    }

    @GetMapping("/roles")
    @PreAuthorize("hasAnyAuthority('user.create', 'user.edit')")
    public ResponseEntity<APIResponse<List<UserRoleResponse>>> getRoles() {
        return ResponseEntity.ok(APIResponse.success(
                HttpStatus.OK.value(),
                "Role list retrieved successfully",
                userService.getRoles()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<User>> getUserById(@PathVariable String id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(APIResponse.success(200, "User found successfully", user));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('user.edit')")
    public ResponseEntity<APIResponse<CreateUserResponse>> updateUser(
            @RequestUser String editorId,
            @RequestAttribute("businessId") String businessId,
            @PathVariable String id,
            @Valid @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(APIResponse.success(
                HttpStatus.OK.value(),
                "User updated successfully",
                userService.updateUser(editorId, businessId, id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully");
    }
}
