package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import server.rem.dtos.security.CreateRoleRequest;
import server.rem.entities.Role;
import server.rem.mappers.PermissionMapper;
import server.rem.mappers.RoleMapper;
import server.rem.repositories.PermissionRepository;
import server.rem.repositories.RoleRepository;

@ExtendWith(MockitoExtension.class)
class SecurityServiceTests {
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private PermissionRepository permissionRepository;
    @Mock
    private PermissionMapper permissionMapper;
    @Mock
    private RoleMapper roleMapper;

    private SecurityService securityService;

    @BeforeEach
    void setUp() {
        securityService = new SecurityService(roleRepository, permissionRepository, permissionMapper, roleMapper);
    }

    @Test
    void mapsAndPersistsRole() {
        CreateRoleRequest request = new CreateRoleRequest("OWNER", "Business owner");
        Role role = Role.builder().name("OWNER").description("Business owner").build();
        when(roleMapper.toEntity(request)).thenReturn(role);
        when(roleRepository.save(role)).thenReturn(role);

        assertSame(role, securityService.createRole(request));
    }
}
