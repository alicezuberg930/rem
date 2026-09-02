package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import server.rem.dtos.auth.RoleResponse;
import server.rem.entities.BusinessUser;
import server.rem.entities.Role;
import server.rem.mappers.AuthMapper;
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

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(businessUserRepository, userRepository, authMapper);
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
}
