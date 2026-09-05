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
import server.rem.entities.BusinessUserId;
import server.rem.entities.Role;
import server.rem.entities.User;
import server.rem.enums.Provider;
import server.rem.mappers.ChatMapper;
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
    private final BusinessRepository businessRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Transactional
    public CreateUserResponse createUser(String invitorId, String businessId, CreateUserRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email already exists");
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new ConflictException("Phone already exists");
        }

        BusinessUser invitorMembership = businessUserRepository
                .findActiveByUserIdAndBusinessId(invitorId, businessId)
                .orElseThrow(() -> new ForbiddenException("Active business membership is required"));
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found"));
        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        User user = userRepository.save(User.builder()
                .fullname(request.getFullname().trim())
                .email(request.getEmail().trim())
                .phone(request.getPhone().trim())
                .birthday(request.getBirthday())
                .provider(Provider.LOCAL)
                .password(passwordEncoder.encode(request.getPassword()))
                .isVerified(request.getIsVerified())
                .build());

        BusinessUser membership = businessUserRepository.save(BusinessUser.builder()
                .id(new BusinessUserId(businessId, user.getId()))
                .business(business)
                .user(user)
                .invitor(invitorMembership.getUser())
                .role(role)
                .isActive(request.getIsActive())
                .isVerified(request.getIsVerified())
                .salary(request.getSalary())
                .dependants(request.getDependants())
                .bankOwner(blankToNull(request.getBankOwner()))
                .bankAccount(blankToNull(request.getBankAccount()))
                .bankName(blankToNull(request.getBankName()))
                .bankCode(blankToNull(request.getBankCode()))
                .bankBranch(blankToNull(request.getBankBranch()))
                .build());

        return toResponse(user, membership);
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

        user.setFullname(request.getFullname().trim());
        user.setEmail(email);
        user.setPhone(phone);
        user.setBirthday(request.getBirthday());
        user.setIsVerified(request.getIsVerified());

        membership.setRole(role);
        membership.setIsActive(request.getIsActive());
        membership.setIsVerified(request.getIsVerified());
        membership.setSalary(request.getSalary());
        membership.setDependants(request.getDependants());
        membership.setBankOwner(blankToNull(request.getBankOwner()));
        membership.setBankAccount(blankToNull(request.getBankAccount()));
        membership.setBankName(blankToNull(request.getBankName()));
        membership.setBankCode(blankToNull(request.getBankCode()));
        membership.setBankBranch(blankToNull(request.getBankBranch()));

        userRepository.save(user);
        businessUserRepository.save(membership);
        return toResponse(user, membership);
    }

    public User getUserById(String id) {
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional(readOnly = true)
    public List<UserRoleResponse> getRoles() {
        return roleRepository.findAll().stream()
                .map(role -> new UserRoleResponse(role.getId(), role.getName(), role.getDescription()))
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
                .map(this::toListResponse)
                .toList();
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private CreateUserResponse toResponse(User user, BusinessUser membership) {
        return new CreateUserResponse(
                user.getId(),
                user.getFullname(),
                user.getEmail(),
                user.getPhone(),
                user.getBirthday(),
                user.getProvider(),
                user.getIsVerified(),
                membership.getBusiness().getId(),
                membership.getRole().getId(),
                membership.getRole().getName(),
                membership.getIsActive(),
                membership.getIsVerified(),
                membership.getSalary(),
                membership.getDependants(),
                membership.getBankOwner(),
                membership.getBankAccount(),
                membership.getBankName(),
                membership.getBankCode(),
                membership.getBankBranch());
    }

    private UserListResponse toListResponse(BusinessUser membership) {
        User user = membership.getUser();
        return new UserListResponse(
                user.getId(),
                user.getFullname(),
                user.getEmail(),
                user.getPhone(),
                user.getBirthday(),
                user.getProvider(),
                user.getIsVerified(),
                membership.getBusiness().getId(),
                membership.getRole().getId(),
                membership.getRole().getName(),
                membership.getIsActive(),
                membership.getIsVerified(),
                membership.getSalary(),
                membership.getDependants(),
                membership.getBankOwner(),
                membership.getBankAccount(),
                membership.getBankName(),
                membership.getBankCode(),
                membership.getBankBranch());
    }
}
