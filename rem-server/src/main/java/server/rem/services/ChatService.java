package server.rem.services;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import server.rem.dtos.chat.ChatMessageRequest;
import server.rem.dtos.chat.ChatMessageResponse;
import server.rem.dtos.chat.ChatUserResponse;
import server.rem.entities.ChatMessage;
import server.rem.mappers.ChatMapper;
import server.rem.repositories.BusinessRepository;
import server.rem.repositories.BusinessUserRepository;
import server.rem.repositories.ChatMessageRepository;
import server.rem.repositories.UserRepository;
import server.rem.utils.exceptions.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
public class ChatService {
    private static final int MAX_MESSAGE_LENGTH = 4000;

    private final ChatMessageRepository chatMessageRepository;
    private final BusinessUserRepository businessUserRepository;
    private final BusinessRepository businessRepository;
    private final UserRepository userRepository;
    private final ChatMapper chatMapper;

    @Transactional(readOnly = true)
    public List<ChatUserResponse> getChatUsers(String currentUserId, String businessId) {
        requireActiveMember(currentUserId, businessId);
        return chatMapper.toUserResponses(
                businessUserRepository.findActiveChatUsers(businessId, currentUserId));
    }

    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getConversation(
            String currentUserId,
            String otherUserId,
            String businessId,
            int limit) {
        requireActiveMember(currentUserId, businessId);
        requireActiveMember(otherUserId, businessId);

        List<ChatMessageResponse> messages = new ArrayList<>(chatMapper.toMessageResponses(
                chatMessageRepository.findConversation(
                        businessId,
                        currentUserId,
                        otherUserId,
                        PageRequest.of(0, Math.min(Math.max(limit, 1), 100)))));
        Collections.reverse(messages);
        return messages;
    }

    @Transactional
    public ChatMessageResponse sendMessage(
            String senderId,
            String businessId,
            ChatMessageRequest request) {
        String recipientId = request.getRecipientId();
        String content = request.getContent() == null ? "" : request.getContent().trim();

        if (recipientId == null || recipientId.isBlank()) {
            throw new IllegalArgumentException("Recipient is required");
        }
        if (senderId.equals(recipientId)) {
            throw new IllegalArgumentException("Cannot send a message to yourself");
        }
        if (content.isEmpty()) {
            throw new IllegalArgumentException("Message cannot be empty");
        }
        if (content.length() > MAX_MESSAGE_LENGTH) {
            throw new IllegalArgumentException("Message cannot exceed 4000 characters");
        }

        requireActiveMember(senderId, businessId);
        requireActiveMember(recipientId, businessId);

        ChatMessage message = chatMapper.toEntity(
                request,
                businessRepository.getReferenceById(businessId),
                userRepository.getReferenceById(senderId),
                userRepository.getReferenceById(recipientId));
        return chatMapper.toMessageResponse(chatMessageRepository.save(message));
    }

    private void requireActiveMember(String userId, String businessId) {
        if (businessUserRepository.findActiveByUserIdAndBusinessId(userId, businessId).isEmpty()) {
            throw new ResourceNotFoundException("Chat user not found");
        }
    }
}
