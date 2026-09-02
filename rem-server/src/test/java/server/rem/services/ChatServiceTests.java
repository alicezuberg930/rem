package server.rem.services;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import server.rem.dtos.chat.ChatMessageRequest;
import server.rem.dtos.chat.ChatMessageResponse;
import server.rem.entities.Business;
import server.rem.entities.BusinessUser;
import server.rem.entities.ChatMessage;
import server.rem.entities.Group;
import server.rem.entities.User;
import server.rem.mappers.ChatMapper;
import server.rem.repositories.BusinessRepository;
import server.rem.repositories.BusinessUserRepository;
import server.rem.repositories.ChatMessageRepository;
import server.rem.repositories.GroupRepository;
import server.rem.repositories.UserRepository;
import server.rem.services.ChatService.ChatMessageDelivery;
import server.rem.utils.exceptions.ForbiddenException;
import server.rem.utils.exceptions.ResourceNotFoundException;

@ExtendWith(MockitoExtension.class)
class ChatServiceTests {
    private static final String BUSINESS_ID = "business-id";
    private static final String SENDER_ID = "sender-id";
    private static final String RECIPIENT_ID = "recipient-id";

    @Mock
    private ChatMessageRepository chatMessageRepository;
    @Mock
    private BusinessUserRepository businessUserRepository;
    @Mock
    private BusinessRepository businessRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private GroupRepository groupRepository;

    private ChatService chatService;

    @BeforeEach
    void setUp() {
        chatService = new ChatService(
                chatMessageRepository,
                businessUserRepository,
                businessRepository,
                userRepository,
                groupRepository,
                Mappers.getMapper(ChatMapper.class));
    }

    @Test
    void sendsAndPersistsMessageForActiveBusinessMembers() {
        Business business = mock(Business.class);
        User sender = user(SENDER_ID);
        User recipient = user(RECIPIENT_ID);
        when(businessUserRepository.findActiveByUserIdAndBusinessId(SENDER_ID, BUSINESS_ID))
                .thenReturn(Optional.of(mock(BusinessUser.class)));
        when(businessUserRepository.findActiveByUserIdAndBusinessId(RECIPIENT_ID, BUSINESS_ID))
                .thenReturn(Optional.of(mock(BusinessUser.class)));
        when(businessRepository.getReferenceById(BUSINESS_ID)).thenReturn(business);
        when(userRepository.getReferenceById(SENDER_ID)).thenReturn(sender);
        when(userRepository.getReferenceById(RECIPIENT_ID)).thenReturn(recipient);
        when(chatMessageRepository.save(any(ChatMessage.class))).thenAnswer(invocation -> {
            ChatMessage message = invocation.getArgument(0);
            message.setId("message-id");
            message.setCreatedAt(LocalDateTime.of(2026, 8, 30, 12, 0));
            return message;
        });

        ChatMessageResponse response = chatService.sendMessage(
                SENDER_ID,
                BUSINESS_ID,
                new ChatMessageRequest(RECIPIENT_ID, "  hello  "));

        ArgumentCaptor<ChatMessage> messageCaptor = ArgumentCaptor.forClass(ChatMessage.class);
        verify(chatMessageRepository).save(messageCaptor.capture());
        assertEquals("hello", messageCaptor.getValue().getContent());
        assertEquals("message-id", response.getId());
        assertEquals(SENDER_ID, response.getSenderId());
        assertEquals(RECIPIENT_ID, response.getRecipientId());
        assertNull(response.getGroupId());
        assertEquals("hello", response.getContent());
    }

    @Test
    void sendsGroupMessageToEveryMemberExceptSender() {
        String groupId = "group-id";
        String otherMemberId = "other-member-id";
        Business business = mock(Business.class);
        User sender = user(SENDER_ID);
        User recipient = user(RECIPIENT_ID);
        User otherMember = user(otherMemberId);
        Group group = mock(Group.class);

        when(group.getId()).thenReturn(groupId);
        when(group.getMembers()).thenReturn(Set.of(sender, recipient, otherMember));
        when(groupRepository.findByIdAndBusinessId(groupId, BUSINESS_ID))
                .thenReturn(Optional.of(group));
        when(businessUserRepository.findActiveByUserIdAndBusinessId(SENDER_ID, BUSINESS_ID))
                .thenReturn(Optional.of(mock(BusinessUser.class)));
        when(businessRepository.getReferenceById(BUSINESS_ID)).thenReturn(business);
        when(userRepository.getReferenceById(SENDER_ID)).thenReturn(sender);
        when(chatMessageRepository.save(any(ChatMessage.class))).thenAnswer(invocation -> {
            ChatMessage message = invocation.getArgument(0);
            message.setId("message-id");
            message.setCreatedAt(LocalDateTime.of(2026, 8, 30, 12, 0));
            return message;
        });

        ChatMessageDelivery delivery = chatService.sendMessageForDelivery(
                SENDER_ID,
                BUSINESS_ID,
                new ChatMessageRequest(null, groupId, "  hello group  "));

        ArgumentCaptor<ChatMessage> messageCaptor = ArgumentCaptor.forClass(ChatMessage.class);
        verify(chatMessageRepository).save(messageCaptor.capture());
        assertEquals(group, messageCaptor.getValue().getGroup());
        assertNull(messageCaptor.getValue().getRecipient());
        assertEquals(groupId, delivery.message().getGroupId());
        assertNull(delivery.message().getRecipientId());
        assertEquals(Set.of(RECIPIENT_ID, otherMemberId), delivery.recipientIds());
    }

    @Test
    void rejectsGroupMessageFromNonMember() {
        String groupId = "group-id";
        Group group = mock(Group.class);
        when(group.getMembers()).thenReturn(Set.of(user(RECIPIENT_ID)));
        when(groupRepository.findByIdAndBusinessId(groupId, BUSINESS_ID))
                .thenReturn(Optional.of(group));
        when(businessUserRepository.findActiveByUserIdAndBusinessId(SENDER_ID, BUSINESS_ID))
                .thenReturn(Optional.of(mock(BusinessUser.class)));

        assertThrows(
                ForbiddenException.class,
                () -> chatService.sendMessage(
                        SENDER_ID,
                        BUSINESS_ID,
                        new ChatMessageRequest(null, groupId, "hello")));
        verify(chatMessageRepository, never()).save(any());
    }

    @Test
    void rejectsRecipientOutsideBusiness() {
        when(businessUserRepository.findActiveByUserIdAndBusinessId(SENDER_ID, BUSINESS_ID))
                .thenReturn(Optional.of(mock(BusinessUser.class)));
        when(businessUserRepository.findActiveByUserIdAndBusinessId(RECIPIENT_ID, BUSINESS_ID))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> chatService.sendMessage(
                        SENDER_ID,
                        BUSINESS_ID,
                        new ChatMessageRequest(RECIPIENT_ID, "hello")));
        verify(chatMessageRepository, never()).save(any());
    }

    @Test
    void rejectsBlankMessageBeforeAccessingPersistence() {
        assertThrows(
                IllegalArgumentException.class,
                () -> chatService.sendMessage(
                        SENDER_ID,
                        BUSINESS_ID,
                        new ChatMessageRequest(RECIPIENT_ID, "   ")));
        verify(businessUserRepository, never()).findActiveByUserIdAndBusinessId(any(), any());
        verify(chatMessageRepository, never()).save(any());
    }

    @Test
    void rejectsAmbiguousTarget() {
        assertThrows(
                IllegalArgumentException.class,
                () -> chatService.sendMessage(
                        SENDER_ID,
                        BUSINESS_ID,
                        new ChatMessageRequest(RECIPIENT_ID, "group-id", "hello")));
        verify(businessUserRepository, never()).findActiveByUserIdAndBusinessId(any(), any());
        verify(chatMessageRepository, never()).save(any());
    }

    private User user(String id) {
        User user = new User();
        user.setId(id);
        return user;
    }
}
