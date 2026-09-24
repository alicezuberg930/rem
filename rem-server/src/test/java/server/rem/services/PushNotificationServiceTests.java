package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import server.rem.dtos.notification.PushClientMetadata;
import server.rem.dtos.notification.PushSubscriptionRequest;
import server.rem.entities.PushNotification;
import server.rem.entities.User;
import server.rem.events.NotificationCreatedEvent;
import server.rem.repositories.PushNotificationRepository;
import server.rem.repositories.UserRepository;
import server.rem.utils.WebPushClient;

@ExtendWith(MockitoExtension.class)
class PushNotificationServiceTests {
    private static final String USER_ID = "user-id";
    private static final String ENDPOINT = "https://push.example.com/subscription";

    @Mock
    private PushNotificationRepository pushNotificationRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private WebPushClient webPushClient;

    private ObjectMapper objectMapper;
    private PushNotificationService pushNotificationService;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
        pushNotificationService = new PushNotificationService(
                pushNotificationRepository,
                userRepository,
                webPushClient,
                objectMapper);
    }

    @Test
    void createsSubscriptionFromBrowserPushSubscription() {
        User user = new User();
        user.setId(USER_ID);
        PushSubscriptionRequest request = validSubscription(ENDPOINT);
        PushClientMetadata metadata = new PushClientMetadata(
                "127.0.0.1",
                "Chromium",
                "desktop",
                null,
                null,
                "x86",
                "Linux");
        when(pushNotificationRepository
                .findAllByUser_IdAndBrowserAndDeviceTypeAndOsOrderByCreatedDateDescIdDesc(
                        USER_ID,
                        "Chromium",
                        "desktop",
                        "Linux"))
                .thenReturn(List.of());
        when(pushNotificationRepository.findAllByEndpointOrderByCreatedDateDesc(ENDPOINT))
                .thenReturn(List.of());
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
        when(pushNotificationRepository.save(any(PushNotification.class))).thenAnswer(invocation -> {
            PushNotification subscription = invocation.getArgument(0);
            subscription.setId("subscription-id");
            return subscription;
        });

        String id = pushNotificationService.subscribe(USER_ID, request, metadata);

        ArgumentCaptor<PushNotification> captor = ArgumentCaptor.forClass(PushNotification.class);
        verify(pushNotificationRepository).save(captor.capture());
        assertEquals("subscription-id", id);
        assertSame(user, captor.getValue().getUser());
        assertEquals(ENDPOINT, captor.getValue().getEndpoint());
        assertEquals("Linux", captor.getValue().getOs());
    }

    @Test
    void reusesLatestSubscriptionAndRemovesDuplicates() {
        User user = new User();
        user.setId(USER_ID);
        PushNotification latest = PushNotification.builder().id("latest").endpoint(ENDPOINT).build();
        PushNotification duplicate = PushNotification.builder().id("duplicate").endpoint(ENDPOINT).build();
        when(pushNotificationRepository.findAllByEndpointOrderByCreatedDateDesc(ENDPOINT))
                .thenReturn(List.of(latest, duplicate));
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
        when(pushNotificationRepository.save(latest)).thenReturn(latest);

        String id = pushNotificationService.subscribe(
                USER_ID,
                validSubscription(ENDPOINT),
                new PushClientMetadata(null, null, null, null, null, null, null));

        assertEquals("latest", id);
        verify(pushNotificationRepository).deleteAll(List.of(duplicate));
        assertSame(user, latest.getUser());
    }

    @Test
    void rejectsNonHttpsEndpoint() {
        PushSubscriptionRequest request = validSubscription("http://localhost/push");

        assertThrows(
                IllegalArgumentException.class,
                () -> pushNotificationService.subscribe(
                        USER_ID,
                        request,
                        new PushClientMetadata(null, null, null, null, null, null, null)));

        verify(pushNotificationRepository, never()).save(any());
    }

    @Test
    void sendsServiceWorkerPayloadAndRemovesExpiredSubscription() throws Exception {
        PushNotification subscription = PushNotification.builder()
                .id("subscription-id")
                .endpoint(ENDPOINT)
                .p256dh(validP256dh())
                .auth(validAuth())
                .build();
        LocalDateTime time = LocalDateTime.of(2026, 9, 16, 8, 0);
        NotificationCreatedEvent event = new NotificationCreatedEvent(
                USER_ID,
                "Task assigned",
                "Review the task",
                "4",
                time,
                "task-assigned",
                "/tasks/pendingIssuance?id=task-id",
                null,
                null,
                Map.of("refID", "task-id", "metaData", "task"));
        when(webPushClient.isConfigured()).thenReturn(true);
        when(pushNotificationRepository.findAllByUser_Id(USER_ID)).thenReturn(List.of(subscription));
        when(webPushClient.send(any(PushNotification.class), any(String.class))).thenReturn(410);

        pushNotificationService.deliver(event);

        ArgumentCaptor<String> payloadCaptor = ArgumentCaptor.forClass(String.class);
        verify(webPushClient).send(eq(subscription), payloadCaptor.capture());
        JsonNode payload = objectMapper.readTree(payloadCaptor.getValue());
        assertEquals("Task assigned", payload.get("title").asText());
        assertEquals("Review the task", payload.get("body").asText());
        assertEquals("4", payload.get("type").asText());
        assertEquals("task-id", payload.get("data").get("refID").asText());
        assertEquals("task-assigned", payload.get("data").get("uniqueKey").asText());
        verify(pushNotificationRepository).deleteByIdAndUser_Id("subscription-id", USER_ID);
    }

    @Test
    void skipsDeliveryWhenVapidIsNotConfigured() {
        when(webPushClient.isConfigured()).thenReturn(false);
        NotificationCreatedEvent event = new NotificationCreatedEvent(
                USER_ID,
                "Title",
                "Body",
                "1",
                LocalDateTime.now(),
                null,
                null,
                null,
                null,
                Map.of());

        pushNotificationService.deliver(event);

        verify(pushNotificationRepository, never()).findAllByUser_Id(any());
        verify(webPushClient, never()).send(any(), any());
    }

    @Test
    void updatesExistingSubscriptionForSameUserBrowserDeviceTypeAndOs() {
        User user = new User();
        user.setId(USER_ID);
        String previousEndpoint = "https://push.example.com/previous-subscription";
        PushNotification existing = PushNotification.builder()
                .id("existing-subscription")
                .user(user)
                .endpoint(previousEndpoint)
                .p256dh("previous-key")
                .auth("previous-auth")
                .browser("Chromium")
                .deviceType("desktop")
                .os("Linux")
                .build();
        PushNotification duplicate = PushNotification.builder()
                .id("duplicate-subscription")
                .user(user)
                .endpoint("https://push.example.com/stale-subscription")
                .browser("Chromium")
                .deviceType("desktop")
                .os("Linux")
                .build();
        PushClientMetadata metadata = new PushClientMetadata(
                "127.0.0.2",
                "Chromium",
                "desktop",
                "Vendor",
                "Model",
                "arm64",
                "Linux");
        when(pushNotificationRepository
                .findAllByUser_IdAndBrowserAndDeviceTypeAndOsOrderByCreatedDateDescIdDesc(
                        USER_ID,
                        "Chromium",
                        "desktop",
                        "Linux"))
                .thenReturn(List.of(existing, duplicate));
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
        when(pushNotificationRepository.save(existing)).thenReturn(existing);

        String id = pushNotificationService.subscribe(
                USER_ID,
                validSubscription(ENDPOINT),
                metadata);

        assertEquals("existing-subscription", id);
        assertEquals(ENDPOINT, existing.getEndpoint());
        assertEquals(validP256dh(), existing.getP256dh());
        assertEquals(validAuth(), existing.getAuth());
        assertEquals("127.0.0.2", existing.getIp());
        assertEquals("Vendor", existing.getDeviceVendor());
        assertEquals("Model", existing.getDeviceModel());
        assertEquals("arm64", existing.getCpu());
        verify(pushNotificationRepository).deleteAll(List.of(duplicate));
        verify(pushNotificationRepository, never())
                .findAllByEndpointOrderByCreatedDateDesc(any());
    }

    @Test
    void sendsTestNotificationWithFavicon() throws Exception {
        PushNotification subscription = PushNotification.builder()
                .id("subscription-id")
                .endpoint(ENDPOINT)
                .p256dh(validP256dh())
                .auth(validAuth())
                .build();
        when(webPushClient.isConfigured()).thenReturn(true);
        when(pushNotificationRepository.findAllByUser_Id(USER_ID)).thenReturn(List.of(subscription));
        when(webPushClient.send(any(PushNotification.class), any(String.class))).thenReturn(201);

        int deliveryCount = pushNotificationService.sendTestNotification(USER_ID);

        ArgumentCaptor<String> payloadCaptor = ArgumentCaptor.forClass(String.class);
        verify(webPushClient).send(eq(subscription), payloadCaptor.capture());
        JsonNode payload = objectMapper.readTree(payloadCaptor.getValue());
        assertEquals(1, deliveryCount);
        assertEquals("Test notification", payload.get("title").asText());
        assertEquals("Push notifications are working correctly.", payload.get("body").asText());
        assertEquals("/favicon.ico", payload.get("icon").asText());
        assertEquals("/favicon.ico", payload.get("badge").asText());
        assertEquals("/settings/notifications", payload.get("link").asText());
    }

    private PushSubscriptionRequest validSubscription(String endpoint) {
        return new PushSubscriptionRequest(
                endpoint,
                new PushSubscriptionRequest.Keys(validP256dh(), validAuth()));
    }

    private String validP256dh() {
        byte[] key = new byte[65];
        key[0] = 4;
        return Base64.getUrlEncoder().withoutPadding().encodeToString(key);
    }

    private String validAuth() {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(new byte[16]);
    }
}
