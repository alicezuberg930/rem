package server.rem.services;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import server.rem.dtos.chat.ChatUserResponse;
import server.rem.dtos.group.AddUsersToGroupRequest;
import server.rem.dtos.group.CreateGroupRequest;
import server.rem.dtos.group.GroupResponse;
import server.rem.entities.BusinessUser;
import server.rem.entities.Group;
import server.rem.entities.User;
import server.rem.repositories.BusinessUserRepository;
import server.rem.repositories.GroupRepository;
import server.rem.utils.exceptions.ConflictException;
import server.rem.utils.exceptions.ForbiddenException;
import server.rem.utils.exceptions.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
public class GroupService {
    private static final String OWNER_ROLE = "OWNER";

    private final GroupRepository groupRepository;
    private final BusinessUserRepository businessUserRepository;

    @Transactional(readOnly = true)
    public List<GroupResponse> getAll(String userId, String businessId) {
        requireActiveMember(userId, businessId);
        return groupRepository.findAllForMember(businessId, userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public GroupResponse create(String ownerId, String businessId, CreateGroupRequest request) {
        BusinessUser ownerMembership = requireOwner(ownerId, businessId);
        List<String> memberIds = normalizeDistinctIds(request.getMembers());
        if (memberIds.size() < 2) {
            throw new IllegalArgumentException("At least 2 distinct members are required");
        }
        if (memberIds.contains(ownerId)) {
            throw new IllegalArgumentException("Creator must not be included in members");
        }

        List<User> selectedMembers = resolveActiveUsers(memberIds, businessId);
        Set<User> members = new LinkedHashSet<>(selectedMembers);
        members.add(ownerMembership.getUser());

        Group group = Group.builder()
                .name(request.getName().trim())
                .avatar(request.getAvatar().trim())
                .business(ownerMembership.getBusiness())
                .members(members)
                .build();
        return toResponse(groupRepository.save(group));
    }

    @Transactional
    public GroupResponse addUsers(String ownerId, String businessId, AddUsersToGroupRequest request) {
        requireOwner(ownerId, businessId);
        Group group = groupRepository.findByIdAndBusinessId(request.getGroupId().trim(), businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found"));
        List<String> memberIds = normalizeDistinctIds(request.getMembers());
        if (memberIds.isEmpty()) {
            throw new IllegalArgumentException("At least 1 member is required");
        }

        Set<String> existingMemberIds = group.getMembers()
                .stream()
                .map(User::getId)
                .collect(Collectors.toSet());
        if (memberIds.stream().anyMatch(existingMemberIds::contains)) {
            throw new ConflictException("User is already a group member");
        }

        group.getMembers().addAll(resolveActiveUsers(memberIds, businessId));
        return toResponse(groupRepository.save(group));
    }

    private BusinessUser requireOwner(String userId, String businessId) {
        BusinessUser membership = requireActiveMember(userId, businessId);
        if (membership.getRole() == null || !OWNER_ROLE.equalsIgnoreCase(membership.getRole().getName())) {
            throw new ForbiddenException("Only business owners can manage groups");
        }
        return membership;
    }

    private BusinessUser requireActiveMember(String userId, String businessId) {
        if (userId == null || userId.isBlank() || businessId == null || businessId.isBlank()) {
            throw new ForbiddenException("Active business membership is required");
        }
        return businessUserRepository.findActiveByUserIdAndBusinessId(userId, businessId)
                .orElseThrow(() -> new ForbiddenException("Active business membership is required"));
    }

    private List<User> resolveActiveUsers(List<String> memberIds, String businessId) {
        List<User> users = businessUserRepository.findActiveUsersByBusinessIdAndUserIdIn(businessId, memberIds);
        if (users.size() != memberIds.size()) {
            throw new IllegalArgumentException("All members must be active users in the current business");
        }

        Map<String, User> usersById = users.stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));
        return memberIds.stream().map(usersById::get).toList();
    }

    private List<String> normalizeDistinctIds(List<String> memberIds) {
        if (memberIds == null) {
            throw new IllegalArgumentException("Members are required");
        }

        List<String> normalizedIds = new ArrayList<>(memberIds.size());
        for (String memberId : memberIds) {
            if (memberId == null || memberId.trim().isEmpty()) {
                throw new IllegalArgumentException("Member ID is required");
            }
            normalizedIds.add(memberId.trim());
        }
        if (new LinkedHashSet<>(normalizedIds).size() != normalizedIds.size()) {
            throw new IllegalArgumentException("Member IDs must be distinct");
        }
        return normalizedIds;
    }

    private GroupResponse toResponse(Group group) {
        List<ChatUserResponse> members = group.getMembers()
                .stream()
                .sorted(Comparator.comparing(
                        User::getFullname,
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER))
                        .thenComparing(User::getId))
                .map(user -> ChatUserResponse.builder()
                        .id(user.getId())
                        .fullname(user.getFullname())
                        .email(user.getEmail())
                        .avatar(user.getAvatar())
                        .build())
                .toList();
        return GroupResponse.builder()
                .id(group.getId())
                .name(group.getName())
                .avatar(group.getAvatar())
                .members(members)
                .build();
    }
}
