package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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
import server.rem.repositories.BusinessRepository;
import server.rem.repositories.BusinessUserRepository;
import server.rem.repositories.RoleRepository;
import server.rem.repositories.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTests {
    @Mock
    private UserRepository userRepository;
    @Mock
    private BusinessUserRepository businessUserRepository;
    @Mock
    private ChatMapper chatMapper;
    @Mock
    private BusinessRepository businessRepository;
    @Mock
    private RoleRepository roleRepository;

    private UserService userService;

    @BeforeEach
    void setUp() {
        userService = new UserService(
                userRepository,
                businessUserRepository,
                chatMapper,
                businessRepository,
                roleRepository);
    }

    @Test
    void returnsUserById() {
        User user = new User();
        when(userRepository.findById("user-id")).thenReturn(Optional.of(user));

        assertSame(user, userService.getUserById("user-id"));
    }

    @Test
    void returnsAvailableRoles() {
        Role role = Role.builder().name("HR").description("Human resources").build();
        role.setId("role-id");
        when(roleRepository.findAll()).thenReturn(List.of(role));

        List<UserRoleResponse> result = userService.getRoles();

        assertEquals(1, result.size());
        assertEquals("role-id", result.getFirst().id());
        assertEquals("HR", result.getFirst().name());
    }

    @Test
    void createsUserAndBusinessMembership() {
        User invitor = User.builder().fullname("Owner").email("owner@example.com").build();
        Business business = Business.builder().name("Business").owner(invitor).build();
        business.setId("business-id");
        Role role = Role.builder().name("HR").build();
        role.setId("role-id");
        BusinessUser invitorMembership = BusinessUser.builder().user(invitor).business(business).build();
        CreateUserRequest request = CreateUserRequest.builder()
                .fullname("New User")
                .email("new.user@example.com")
                .phone("+15550000001")
                .password("password1")
                .confirmPassword("password1")
                .roleId("role-id")
                .isActive(true)
                .isVerified(true)
                .salary(20_000_000)
                .dependants(1)
                .bankOwner("New User")
                .bankAccount("123456")
                .bankName("Test Bank")
                .bankCode("TEST")
                .bankBranch("Main")
                .build();

        when(businessUserRepository.findActiveByUserIdAndBusinessId("owner-id", "business-id"))
                .thenReturn(Optional.of(invitorMembership));
        when(businessRepository.findById("business-id")).thenReturn(Optional.of(business));
        when(roleRepository.findById("role-id")).thenReturn(Optional.of(role));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId("new-user-id");
            return user;
        });
        when(businessUserRepository.save(any(BusinessUser.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        CreateUserResponse created = userService.createUser("owner-id", "business-id", request);

        assertEquals("new-user-id", created.id());
        assertEquals("business-id", created.businessId());
        assertEquals("role-id", created.roleId());
        ArgumentCaptor<BusinessUser> membershipCaptor = ArgumentCaptor.forClass(BusinessUser.class);
        verify(businessUserRepository).save(membershipCaptor.capture());
        BusinessUser membership = membershipCaptor.getValue();
        assertEquals("business-id", membership.getId().getBusinessId());
        assertEquals("new-user-id", membership.getId().getUserId());
        assertNotEquals(request.getPassword(), membership.getUser().getPassword());
        assertSame(invitor, membership.getInvitor());
        assertSame(business, membership.getBusiness());
        assertSame(role, membership.getRole());
        assertEquals(20_000_000, membership.getSalary());
        assertEquals(1, membership.getDependants());
    }

    @Test
    void updatesUserAndCurrentBusinessMembership() {
        User editor = User.builder().fullname("Owner").email("owner@example.com").build();
        User user = User.builder()
                .fullname("Old Name")
                .email("old@example.com")
                .phone("+15550000001")
                .password("existing-password")
                .isVerified(false)
                .build();
        user.setId("user-id");
        Business business = Business.builder().name("Business").owner(editor).build();
        business.setId("business-id");
        Role oldRole = Role.builder().name("Employee").build();
        Role newRole = Role.builder().name("Manager").build();
        newRole.setId("manager-role-id");
        BusinessUser editorMembership = BusinessUser.builder().user(editor).business(business).build();
        BusinessUser membership = BusinessUser.builder()
                .business(business)
                .user(user)
                .role(oldRole)
                .isActive(true)
                .isVerified(false)
                .salary(10_000_000)
                .dependants(0)
                .build();
        UpdateUserRequest request = UpdateUserRequest.builder()
                .fullname("Updated Name")
                .email("updated@example.com")
                .phone("+15550000002")
                .roleId("manager-role-id")
                .isActive(false)
                .isVerified(true)
                .salary(25_000_000)
                .dependants(2)
                .bankOwner("Updated Name")
                .bankAccount("654321")
                .bankName("Updated Bank")
                .bankCode("UPDATED")
                .bankBranch("Central")
                .build();

        when(businessUserRepository.findActiveByUserIdAndBusinessId("editor-id", "business-id"))
                .thenReturn(Optional.of(editorMembership));
        when(userRepository.findById("user-id")).thenReturn(Optional.of(user));
        when(businessUserRepository.findByUserIdAndBusinessId("user-id", "business-id"))
                .thenReturn(Optional.of(membership));
        when(roleRepository.findById("manager-role-id")).thenReturn(Optional.of(newRole));
        when(userRepository.save(user)).thenReturn(user);
        when(businessUserRepository.save(membership)).thenReturn(membership);

        CreateUserResponse updated = userService.updateUser("editor-id", "business-id", "user-id", request);

        assertEquals("Updated Name", updated.fullname());
        assertEquals("updated@example.com", updated.email());
        assertEquals("existing-password", user.getPassword());
        assertSame(newRole, membership.getRole());
        assertEquals(false, membership.getIsActive());
        assertEquals(true, membership.getIsVerified());
        assertEquals(25_000_000, membership.getSalary());
        assertEquals(2, membership.getDependants());
        assertEquals("654321", membership.getBankAccount());
        verify(userRepository).save(user);
        verify(businessUserRepository).save(membership);
    }

    @Test
    void returnsBusinessUserListWithMembershipFields() {
        User viewer = User.builder().fullname("Owner").build();
        User user = User.builder()
                .fullname("List User")
                .email("list.user@example.com")
                .phone("+15550000003")
                .isVerified(true)
                .build();
        user.setId("list-user-id");
        Business business = Business.builder().name("Business").build();
        business.setId("business-id");
        Role role = Role.builder().name("HR").description("Human resources").build();
        role.setId("role-id");
        BusinessUser viewerMembership = BusinessUser.builder().user(viewer).business(business).build();
        BusinessUser membership = BusinessUser.builder()
                .business(business)
                .user(user)
                .role(role)
                .isActive(true)
                .isVerified(true)
                .salary(15_000_000)
                .dependants(1)
                .build();

        when(businessUserRepository.findActiveByUserIdAndBusinessId("viewer-id", "business-id"))
                .thenReturn(Optional.of(viewerMembership));
        when(businessUserRepository.findUsersByBusinessId("business-id"))
                .thenReturn(List.of(membership));

        List<UserListResponse> users = userService.getBusinessUsers("viewer-id", "business-id");

        assertEquals(1, users.size());
        assertEquals("list-user-id", users.getFirst().id());
        assertEquals("HR", users.getFirst().roleName());
        assertEquals(15_000_000, users.getFirst().salary());
        assertEquals(true, users.getFirst().membershipVerified());
    }
}
