package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import server.rem.dtos.group.AddUsersToGroupRequest;
import server.rem.dtos.group.CreateGroupRequest;
import server.rem.dtos.group.GroupResponse;
import server.rem.entities.Business;
import server.rem.entities.BusinessUser;
import server.rem.entities.Group;
import server.rem.entities.Role;
import server.rem.entities.User;
import server.rem.repositories.BusinessUserRepository;
import server.rem.repositories.GroupRepository;
import server.rem.utils.exceptions.ConflictException;
import server.rem.utils.exceptions.ForbiddenException;

@ExtendWith(MockitoExtension.class)
class GroupServiceTests {
    private static final String BUSINESS_ID = "business-id";
    private static final String OWNER_ID = "owner-id";

    @Mock
    private GroupRepository groupRepository;
    @Mock
    private BusinessUserRepository businessUserRepository;

    private GroupService groupService;

    @BeforeEach
    void setUp() {
        groupService = new GroupService(groupRepository, businessUserRepository);
    }

    @Test
    void createsBusinessScopedGroupAndAddsOwner() {
        Business business = business();
        User owner = user(OWNER_ID, "Owner");
        User firstMember = user("member-1", "Alice");
        User secondMember = user("member-2", "Brian");
        when(businessUserRepository.findActiveByUserIdAndBusinessId(OWNER_ID, BUSINESS_ID))
                .thenReturn(Optional.of(membership(owner, business, "OWNER")));
        when(businessUserRepository.findActiveUsersByBusinessIdAndUserIdIn(
                BUSINESS_ID,
                List.of("member-1", "member-2")))
                .thenReturn(List.of(firstMember, secondMember));
        when(groupRepository.save(any(Group.class))).thenAnswer(invocation -> {
            Group group = invocation.getArgument(0);
            group.setId("group-id");
            return group;
        });

        GroupResponse response = groupService.create(
                OWNER_ID,
                BUSINESS_ID,
                new CreateGroupRequest("  Product  ", "  avatar-url  ", List.of("member-1", "member-2")));

        ArgumentCaptor<Group> groupCaptor = ArgumentCaptor.forClass(Group.class);
        verify(groupRepository).save(groupCaptor.capture());
        Group savedGroup = groupCaptor.getValue();
        assertSame(business, savedGroup.getBusiness());
        assertEquals("Product", savedGroup.getName());
        assertEquals("avatar-url", savedGroup.getAvatar());
        assertEquals(3, savedGroup.getMembers().size());
        assertEquals("group-id", response.getId());
        assertEquals(3, response.getMembers().size());
    }

    @Test
    void rejectsNonOwner() {
        when(businessUserRepository.findActiveByUserIdAndBusinessId(OWNER_ID, BUSINESS_ID))
                .thenReturn(Optional.of(membership(user(OWNER_ID, "User"), business(), "HR")));

        assertThrows(
                ForbiddenException.class,
                () -> groupService.create(
                        OWNER_ID,
                        BUSINESS_ID,
                        new CreateGroupRequest("Product", "avatar-url", List.of("member-1", "member-2"))));
        verify(groupRepository, never()).save(any());
    }

    @Test
    void rejectsDuplicateMemberIdsAfterTrimming() {
        Business business = business();
        when(businessUserRepository.findActiveByUserIdAndBusinessId(OWNER_ID, BUSINESS_ID))
                .thenReturn(Optional.of(membership(user(OWNER_ID, "Owner"), business, "OWNER")));

        assertThrows(
                IllegalArgumentException.class,
                () -> groupService.create(
                        OWNER_ID,
                        BUSINESS_ID,
                        new CreateGroupRequest("Product", "avatar-url", List.of("member-1", " member-1 "))));
        verify(businessUserRepository, never())
                .findActiveUsersByBusinessIdAndUserIdIn(any(), any());
        verify(groupRepository, never()).save(any());
    }

    @Test
    void rejectsMemberOutsideCurrentBusiness() {
        Business business = business();
        User owner = user(OWNER_ID, "Owner");
        when(businessUserRepository.findActiveByUserIdAndBusinessId(OWNER_ID, BUSINESS_ID))
                .thenReturn(Optional.of(membership(owner, business, "OWNER")));
        when(businessUserRepository.findActiveUsersByBusinessIdAndUserIdIn(
                BUSINESS_ID,
                List.of("member-1", "outside-member")))
                .thenReturn(List.of(user("member-1", "Alice")));

        assertThrows(
                IllegalArgumentException.class,
                () -> groupService.create(
                        OWNER_ID,
                        BUSINESS_ID,
                        new CreateGroupRequest(
                                "Product",
                                "avatar-url",
                                List.of("member-1", "outside-member"))));
        verify(groupRepository, never()).save(any());
    }

    @Test
    void rejectsAddingExistingGroupMember() {
        Business business = business();
        User owner = user(OWNER_ID, "Owner");
        User member = user("member-1", "Alice");
        Group group = Group.builder()
                .name("Product")
                .avatar("avatar-url")
                .business(business)
                .members(new LinkedHashSet<>(List.of(owner, member)))
                .build();
        group.setId("group-id");
        when(businessUserRepository.findActiveByUserIdAndBusinessId(OWNER_ID, BUSINESS_ID))
                .thenReturn(Optional.of(membership(owner, business, "OWNER")));
        when(groupRepository.findByIdAndBusinessId("group-id", BUSINESS_ID))
                .thenReturn(Optional.of(group));

        assertThrows(
                ConflictException.class,
                () -> groupService.addUsers(
                        OWNER_ID,
                        BUSINESS_ID,
                        new AddUsersToGroupRequest("group-id", List.of("member-1"))));
        verify(groupRepository, never()).save(any());
    }

    private Business business() {
        Business business = new Business();
        business.setId(BUSINESS_ID);
        return business;
    }

    private BusinessUser membership(User user, Business business, String roleName) {
        return BusinessUser.builder()
                .user(user)
                .business(business)
                .role(Role.builder().name(roleName).build())
                .isActive(true)
                .build();
    }

    private User user(String id, String fullname) {
        User user = new User();
        user.setId(id);
        user.setFullname(fullname);
        user.setEmail(id + "@example.com");
        return user;
    }
}
