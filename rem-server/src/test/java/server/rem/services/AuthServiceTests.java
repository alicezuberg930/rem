package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import server.rem.dtos.auth.RoleResponse;
import server.rem.dtos.auth.SignInRequest;
import server.rem.dtos.auth.SignInResponse;
import server.rem.dtos.auth.UserBusinessResponse;
import server.rem.dtos.auth.UserProfileResponse;
import server.rem.entities.BusinessUser;
import server.rem.entities.Role;
import server.rem.entities.User;
import server.rem.enums.AuthProvider;
import server.rem.mappers.AuthMapper;
import server.rem.mappers.UserMapper;
import server.rem.repositories.BusinessUserRepository;
import server.rem.repositories.UserRepository;

@ExtendWith(MockitoExtension.class)
class AuthServiceTests {
    @Mock
    private BusinessUserRepository businessUserRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private AuthMapper authMapper;
    @Mock
    private UserMapper userMapper;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(businessUserRepository, userRepository, authMapper, userMapper);
    }

    @Test
    void returnsCurrentBusinessRole() {
        Role role = Role.builder().name("OWNER").build();
        BusinessUser businessUser = BusinessUser.builder().role(role).build();
        RoleResponse response = new RoleResponse("OWNER", null, java.util.List.of());
        when(businessUserRepository.findByUserIdAndBusinessId("user-id", "business-id"))
                .thenReturn(Optional.of(businessUser));
        when(authMapper.toRoleResponse(role)).thenReturn(response);

        assertSame(response, authService.getCurrentRole("user-id", "business-id"));
    }

    @Test
    void signInReturnsProfileWithBusinesses() throws Exception {
        User credentialsUser = new User();
        credentialsUser.setId("user-id");
        credentialsUser.setEmail("alice.nguyen@example.com");
        credentialsUser.setPassword(new BCryptPasswordEncoder().encode("123456789"));

        User profileUser = new User();
        profileUser.setId("user-id");

        UserProfileResponse profileResponse = new UserProfileResponse(
                "user-id",
                null,
                null,
                null,
                "Alice Nguyen",
                "alice.nguyen@example.com",
                null,
                AuthProvider.LOCAL,
                true,
                List.of(org.mockito.Mockito.mock(UserBusinessResponse.class))
        );
        SignInResponse expected = new SignInResponse(profileResponse, "access-token", "refresh-token", 123L);

        ReflectionTestUtils.setField(authService, "accessTokenSecret", "access-secret");
        ReflectionTestUtils.setField(authService, "refreshTokenSecret", "refresh-secret");
        ReflectionTestUtils.setField(authService, "accessTokenExpiration", "60");
        ReflectionTestUtils.setField(authService, "refreshTokenExpiration", "120");

        when(userRepository.findByEmail("alice.nguyen@example.com")).thenReturn(Optional.of(credentialsUser));
        when(userRepository.findProfileById("user-id")).thenReturn(Optional.of(profileUser));
        when(authMapper.toResponse(eq(profileUser), anyString(), anyString(), anyLong())).thenReturn(expected);

        SignInResponse response = authService.signIn(new SignInRequest("alice.nguyen@example.com", "123456789"));

        assertSame(expected, response);
        assertEquals(1, response.getUser().getBusinesses().size());
        verify(userRepository).findProfileById("user-id");
        verify(authMapper).toResponse(eq(profileUser), anyString(), anyString(), anyLong());
    }
}
