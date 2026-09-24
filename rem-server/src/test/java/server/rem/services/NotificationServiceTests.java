package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import server.rem.dtos.notification.CreateNotificationRequest;
import server.rem.dtos.notification.NotificationResponse;
import server.rem.entities.Business;
import server.rem.entities.BusinessUser;
import server.rem.entities.Notification;
import server.rem.entities.User;
import server.rem.events.NotificationCreatedEvent;
import server.rem.mappers.NotificationMapper;
import server.rem.repositories.BusinessUserRepository;
import server.rem.repositories.NotificationRepository;
import server.rem.utils.exceptions.ResourceNotFoundException;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTests {
    private static final String BUSINESS_ID = "business-id";
    private static final String USER_ID = "user-id";

    @Mock
    private NotificationRepository notificationRepository;
    @Mock
    private BusinessUserRepository businessUserRepository;
    @Mock
    private ApplicationEventPublisher eventPublisher;

    private NotificationService notificationService;

    @BeforeEach
    void setUp() {
        notificationService = new NotificationService(
                notificationRepository,
                businessUserRepository,
                Mappers.getMapper(NotificationMapper.class),
                eventPublisher);
    }

    @Test
    void createsBusinessScopedNotificationAndPublishesDeliveryEvent() {
        Business business = new Business();
        business.setId(BUSINESS_ID);
        User user = new User();
        user.setId(USER_ID);
        BusinessUser membership = BusinessUser.builder().business(business).user(user).build();
        CreateNotificationRequest request = new CreateNotificationRequest(
                "  Task assigned  ",
                "  Review the task  ",
                "4",
                USER_ID,
                "task-assigned",
                "/tasks/pendingIssuance?id=task-id",
                null,
                null,
                Map.of("refID", "task-id"));

        when(businessUserRepository.findActiveByUserIdAndBusinessId(USER_ID, BUSINESS_ID))
                .thenReturn(Optional.of(membership));
        when(notificationRepository.save(any(Notification.class))).thenAnswer(invocation -> {
            Notification notification = invocation.getArgument(0);
            notification.setId("notification-id");
            return notification;
        });

        NotificationResponse response = notificationService.create(request, BUSINESS_ID);

        ArgumentCaptor<Notification> notificationCaptor = ArgumentCaptor.forClass(Notification.class);
        verify(notificationRepository).save(notificationCaptor.capture());
        Notification notification = notificationCaptor.getValue();
        assertSame(business, notification.getBusiness());
        assertSame(user, notification.getToUser());
        assertEquals("Task assigned", notification.getTitle());
        assertEquals("Review the task", notification.getContent());
        assertFalse(notification.isRead());
        assertEquals("notification-id", response.id());

        ArgumentCaptor<NotificationCreatedEvent> eventCaptor = ArgumentCaptor.forClass(NotificationCreatedEvent.class);
        verify(eventPublisher).publishEvent(eventCaptor.capture());
        assertEquals(USER_ID, eventCaptor.getValue().userId());
        assertEquals("task-id", eventCaptor.getValue().data().get("refID"));
        assertEquals(BUSINESS_ID, eventCaptor.getValue().businessId());
        assertSame(response, eventCaptor.getValue().notification());
    }

    @Test
    void rejectsTargetOutsideBusiness() {
        CreateNotificationRequest request = new CreateNotificationRequest(
                "Title",
                "Content",
                "4",
                USER_ID,
                null,
                null,
                null,
                null,
                null);
        when(businessUserRepository.findActiveByUserIdAndBusinessId(USER_ID, BUSINESS_ID))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> notificationService.create(request, BUSINESS_ID));

        verify(notificationRepository, never()).save(any());
        verify(eventPublisher, never()).publishEvent(any());
    }
}
