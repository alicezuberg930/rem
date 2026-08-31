package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mapstruct.factory.Mappers;
import server.rem.dtos.chat.ChatMessageRequest;
import server.rem.dtos.chat.ChatMessageResponse;
import server.rem.entities.Business;
import server.rem.entities.BusinessUser;
import server.rem.entities.ChatMessage;
import server.rem.entities.User;
import server.rem.mappers.ChatMapper;
import server.rem.repositories.BusinessRepository;
import server.rem.repositories.BusinessUserRepository;
import server.rem.repositories.ChatMessageRepository;
import server.rem.repositories.UserRepository;
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

    private ChatService chatService;

    @BeforeEach
    void setUp() {
        chatService = new ChatService(
                chatMessageRepository,
                businessUserRepository,
                businessRepository,
                userRepository,
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
        assertEquals("hello", response.getContent());
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

    private User user(String id) {
        User user = new User();
        user.setId(id);
        return user;
    }
}
