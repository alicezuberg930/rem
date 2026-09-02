package server.rem.services;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import server.rem.dtos.chat.ChatMessageRequest;
import server.rem.dtos.chat.ChatMessageResponse;
import server.rem.dtos.chat.ChatUserResponse;
import server.rem.entities.ChatMessage;
import server.rem.entities.Group;
import server.rem.entities.User;
import server.rem.mappers.ChatMapper;
import server.rem.repositories.BusinessRepository;
import server.rem.repositories.BusinessUserRepository;
import server.rem.repositories.ChatMessageRepository;
import server.rem.repositories.GroupRepository;
import server.rem.repositories.UserRepository;
import server.rem.utils.exceptions.ForbiddenException;
import server.rem.utils.exceptions.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
public class ChatService {
    private static final int MAX_MESSAGE_LENGTH = 4000;

    private final ChatMessageRepository chatMessageRepository;
    private final BusinessUserRepository businessUserRepository;
    private final BusinessRepository businessRepository;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final ChatMapper chatMapper;

    public record ChatMessageDelivery(
            ChatMessageResponse message,
            Set<String> recipientIds) {
        public ChatMessageDelivery {
            recipientIds = Set.copyOf(recipientIds);
        }
    }

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

    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getGroupConversation(
            String currentUserId,
            String groupId,
            String businessId,
            int limit) {
        requireActiveMember(currentUserId, businessId);
        requireGroupMember(currentUserId, businessId, groupId);

        List<ChatMessageResponse> messages = new ArrayList<>(chatMapper.toMessageResponses(
                chatMessageRepository.findGroupConversation(
                        businessId,
                        groupId,
                        PageRequest.of(0, normalizeLimit(limit)))));
        Collections.reverse(messages);
        return messages;
    }

    @Transactional
    public ChatMessageResponse sendMessage(
            String senderId,
            String businessId,
            ChatMessageRequest request) {
        return persistMessage(senderId, businessId, request).message();
    }

    @Transactional
    public ChatMessageDelivery sendMessageForDelivery(
            String senderId,
            String businessId,
            ChatMessageRequest request) {
        return persistMessage(senderId, businessId, request);
    }

    private ChatMessageDelivery persistMessage(
            String senderId,
            String businessId,
            ChatMessageRequest request) {
        String recipientId = normalizeId(request.getRecipientId());
        String groupId = normalizeId(request.getGroupId());
        String content = request.getContent() == null ? "" : request.getContent().trim();

        if (content.isEmpty()) {
            throw new IllegalArgumentException("Message cannot be empty");
        }
        if (content.length() > MAX_MESSAGE_LENGTH) {
            throw new IllegalArgumentException("Message cannot exceed 4000 characters");
        }
        if ((recipientId == null) == (groupId == null)) {
            throw new IllegalArgumentException("Exactly one of recipientId or groupId is required");
        }

        requireActiveMember(senderId, businessId);

        User recipient = null;
        Group group = null;
        Set<String> deliveryRecipientIds;

        if (recipientId != null) {
            if (senderId.equals(recipientId)) {
                throw new IllegalArgumentException("Cannot send a message to yourself");
            }
            requireActiveMember(recipientId, businessId);
            recipient = userRepository.getReferenceById(recipientId);
            deliveryRecipientIds = Set.of(senderId, recipientId);
        } else {
            group = requireGroupMember(senderId, businessId, groupId);
            deliveryRecipientIds = group.getMembers().stream()
                    .map(User::getId)
                    .filter(memberId -> !senderId.equals(memberId))
                    .collect(Collectors.toUnmodifiableSet());
        }

        ChatMessage message = chatMapper.toEntity(
                request,
                businessRepository.getReferenceById(businessId),
                userRepository.getReferenceById(senderId),
                recipient,
                group);
        ChatMessageResponse response = chatMapper.toMessageResponse(chatMessageRepository.save(message));
        return new ChatMessageDelivery(response, deliveryRecipientIds);
    }

    private Group requireGroupMember(String userId, String businessId, String groupId) {
        Group group = groupRepository.findByIdAndBusinessId(groupId, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat group not found"));
        boolean isMember = group.getMembers().stream()
                .anyMatch(member -> userId.equals(member.getId()));
        if (!isMember) {
            throw new ForbiddenException("You are not a member of this group");
        }
        return group;
    }

    private int normalizeLimit(int limit) {
        return Math.min(Math.max(limit, 1), 100);
    }

    private String normalizeId(String id) {
        if (id == null || id.isBlank()) {
            return null;
        }
        return id.trim();
    }

    private void requireActiveMember(String userId, String businessId) {
        if (businessUserRepository.findActiveByUserIdAndBusinessId(userId, businessId).isEmpty()) {
            throw new ResourceNotFoundException("Chat user not found");
        }
    }
}
