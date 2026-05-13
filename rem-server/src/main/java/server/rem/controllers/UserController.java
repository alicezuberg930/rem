package server.rem.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import server.rem.dtos.APIResponse;
import server.rem.entities.User;
import server.rem.repositories.UserRepository;
import server.rem.services.UserService;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {
    private final UserRepository userRepository;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        if (user.getPhone() != null && userRepository.existsByPhone(user.getPhone())) {
            return ResponseEntity.badRequest().body("Phone already exists");
        }

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping
    public ResponseEntity<APIResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok().body(APIResponse.success(
                200,
                "User list retrieved successfully",
                userService.getAllUsers()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<User>> getUserById(@PathVariable String id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(APIResponse.success(200, "User found successfully", user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User updatedUser) {
        Optional<User> existingUserOpt = userRepository.findById(id);

        if (existingUserOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User existingUser = existingUserOpt.get();

        // Update fields
        existingUser.setFullname(updatedUser.getFullname());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setPhone(updatedUser.getPhone());
        existingUser.setAvatar(updatedUser.getAvatar());
        existingUser.setBirthday(updatedUser.getBirthday());
        existingUser.setProvider(updatedUser.getProvider());
        existingUser.setIsVerified(updatedUser.getIsVerified());

        User savedUser = userRepository.save(existingUser);

        return ResponseEntity.ok(savedUser);
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