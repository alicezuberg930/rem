package server.rem.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import server.rem.dtos.chat.ChatUserResponse;
import server.rem.entities.User;
import server.rem.mappers.ChatMapper;
import server.rem.repositories.BusinessUserRepository;
import server.rem.repositories.UserRepository;
import server.rem.utils.exceptions.ForbiddenException;
import server.rem.utils.exceptions.ResourceNotFoundException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BusinessUserRepository businessUserRepository;
    private final ChatMapper chatMapper;

    public User getUserById(String id) {
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional(readOnly = true)
    public List<ChatUserResponse> getUsers(String currentUserId, String businessId, boolean isChat) {
        if (businessUserRepository.findActiveByUserIdAndBusinessId(currentUserId, businessId).isEmpty()) {
            throw new ForbiddenException("Active business membership is required");
        }
        List<User> users = isChat
                ? businessUserRepository.findActiveChatUsers(businessId, currentUserId)
                : businessUserRepository.findActiveUsersByBusinessId(businessId);
        return chatMapper.toUserResponses(users);
    }
}
