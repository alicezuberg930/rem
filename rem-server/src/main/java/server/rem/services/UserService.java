package server.rem.services;

import java.util.List;
import java.util.Objects;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import server.rem.dtos.chat.ChatUserResponse;
import server.rem.dtos.user.CreateUserRequest;
import server.rem.dtos.user.CreateUserResponse;
import server.rem.dtos.user.UpdateUserRequest;
import server.rem.dtos.user.UserListResponse;
import server.rem.dtos.user.UserRoleResponse;
import server.rem.entities.Business;
import server.rem.entities.BusinessUser;
import server.rem.entities.Role;
import server.rem.entities.User;
import server.rem.mappers.ChatMapper;
import server.rem.mappers.UserMapper;
import server.rem.repositories.BusinessRepository;
import server.rem.repositories.BusinessUserRepository;
import server.rem.repositories.RoleRepository;
import server.rem.repositories.UserRepository;
import server.rem.utils.exceptions.ConflictException;
import server.rem.utils.exceptions.ForbiddenException;
import server.rem.utils.exceptions.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BusinessUserRepository businessUserRepository;
    private final ChatMapper chatMapper;
    private final UserMapper userMapper;
    private final BusinessRepository businessRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Transactional
    public CreateUserResponse createUser(String invitorId, String businessId, CreateUserRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }
        String email = request.getEmail().trim();
        String phone = request.getPhone().trim();
        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("Email already exists");
        }
        if (userRepository.existsByPhone(phone)) {
            throw new ConflictException("Phone already exists");
        }

        BusinessUser invitorMembership = businessUserRepository
                .findActiveByUserIdAndBusinessId(invitorId, businessId)
                .orElseThrow(() -> new ForbiddenException("Active business membership is required"));
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found"));
        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        User user = userRepository.save(userMapper.toEntity(request, passwordEncoder.encode(request.getPassword())));
        BusinessUser membership = businessUserRepository.save(
                userMapper.toMembership(request, business, user, invitorMembership.getUser(), role)
        );

        return userMapper.toCreateUserResponse(user, membership);
    }

    @Transactional
    public CreateUserResponse updateUser(
            String editorId,
            String businessId,
            String userId,
            UpdateUserRequest request) {
        businessUserRepository.findActiveByUserIdAndBusinessId(editorId, businessId)
                .orElseThrow(() -> new ForbiddenException("Active business membership is required"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        BusinessUser membership = businessUserRepository.findByUserIdAndBusinessId(userId, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business membership not found"));
        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        String email = request.getEmail().trim();
        String phone = request.getPhone().trim();
        if (!email.equals(user.getEmail()) && userRepository.existsByEmail(email)) {
            throw new ConflictException("Email already exists");
        }
        if (!phone.equals(user.getPhone()) && userRepository.existsByPhone(phone)) {
            throw new ConflictException("Phone already exists");
        }
        if (!Objects.equals(request.getPassword(), request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }
        if (request.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        userMapper.updateEntity(request, user);
        user.setEmail(email);
        user.setPhone(phone);
        userMapper.updateMembership(request, role, membership);

        userRepository.save(user);
        businessUserRepository.save(membership);
        return userMapper.toCreateUserResponse(user, membership);
    }

    public User getUserById(String id) {
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional(readOnly = true)
    public List<UserRoleResponse> getRoles() {
        return roleRepository.findAll().stream()
                .map(userMapper::toRoleResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ChatUserResponse> getChatUsers(String currentUserId, String businessId) {
        if (businessUserRepository.findActiveByUserIdAndBusinessId(currentUserId, businessId).isEmpty()) {
            throw new ForbiddenException("Active business membership is required");
        }
        List<User> users = businessUserRepository.findActiveChatUsers(businessId, currentUserId);
        return chatMapper.toUserResponses(users);
    }

    @Transactional(readOnly = true)
    public List<UserListResponse> getBusinessUsers(String currentUserId, String businessId) {
        if (businessUserRepository.findActiveByUserIdAndBusinessId(currentUserId, businessId).isEmpty()) {
            throw new ForbiddenException("Active business membership is required");
        }
        return businessUserRepository.findUsersByBusinessId(businessId).stream()
                .map(userMapper::toListResponse)
                .toList();
    }
}
