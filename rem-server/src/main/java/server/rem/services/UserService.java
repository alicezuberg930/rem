package server.rem.services;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import server.rem.entities.User;
import server.rem.mappers.AuthMapper;
import server.rem.repositories.BusinessUserRepository;
import server.rem.repositories.UserRepository;
import server.rem.utils.exceptions.ResourceNotFoundException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BusinessUserRepository businessUserRepository;
    private final AuthMapper authMapper;

    public User getUserById(String id) {
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}