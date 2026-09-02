package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import server.rem.entities.User;
import server.rem.mappers.ChatMapper;
import server.rem.repositories.BusinessUserRepository;
import server.rem.repositories.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTests {
    @Mock
    private UserRepository userRepository;
    @Mock
    private BusinessUserRepository businessUserRepository;
    @Mock
    private ChatMapper chatMapper;

    private UserService userService;

    @BeforeEach
    void setUp() {
        userService = new UserService(userRepository, businessUserRepository, chatMapper);
    }

    @Test
    void returnsUserById() {
        User user = new User();
        when(userRepository.findById("user-id")).thenReturn(Optional.of(user));

        assertSame(user, userService.getUserById("user-id"));
    }
}
