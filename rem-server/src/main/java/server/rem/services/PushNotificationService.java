package server.rem.services;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.util.StringUtils;
import server.rem.dtos.notification.PushClientMetadata;
import server.rem.dtos.notification.PushSubscriptionRequest;
import server.rem.entities.PushNotification;
import server.rem.events.NotificationCreatedEvent;
import server.rem.repositories.PushNotificationRepository;
import server.rem.repositories.UserRepository;
import server.rem.utils.Utils;
import server.rem.utils.WebPushClient;
import server.rem.utils.exceptions.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
@Slf4j
public class PushNotificationService {
    private static final int GONE = 410;
    private static final int NOT_FOUND = 404;
    private static final String TEST_NOTIFICATION_TITLE = "Test notification";
    private static final String TEST_NOTIFICATION_BODY = "Push notifications are working correctly.";
    private static final String TEST_NOTIFICATION_ICON = "/favicon.ico";

    private final PushNotificationRepository pushNotificationRepository;
    private final UserRepository userRepository;
    private final WebPushClient webPushClient;
    private final ObjectMapper objectMapper;

    @Transactional
    public String subscribe(
            String userId,
            PushSubscriptionRequest request,
            PushClientMetadata metadata) {
        validateSubscription(request);
        String browser = truncate(metadata.browser(), 255);
        String deviceType = truncate(metadata.deviceType(), 255);
        String os = truncate(metadata.os(), 255);
        List<PushNotification> matches = pushNotificationRepository
                .findAllByUser_IdAndBrowserAndDeviceTypeAndOsOrderByCreatedDateDescIdDesc(
                        userId,
                        browser,
                        deviceType,
                        os);
        if (matches.isEmpty()) {
            matches = pushNotificationRepository.findAllByEndpointOrderByCreatedDateDesc(request.endpoint());
        }
        PushNotification subscription;
        if (matches.isEmpty()) {
            subscription = new PushNotification();
        } else {
            subscription = matches.getFirst();
            if (matches.size() > 1) {
                pushNotificationRepository.deleteAll(matches.subList(1, matches.size()));
            }
        }
        subscription.setUser(
                userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found")));
        subscription.setEndpoint(request.endpoint());
        subscription.setP256dh(request.keys().p256dh());
        subscription.setAuth(request.keys().auth());
        subscription.setIp(truncate(metadata.ip(), 45));
        subscription.setBrowser(browser);
        subscription.setDeviceType(deviceType);
        subscription.setDeviceVendor(truncate(metadata.deviceVendor(), 255));
        subscription.setDeviceModel(truncate(metadata.deviceModel(), 255));
        subscription.setCpu(truncate(metadata.cpu(), 255));
        subscription.setOs(os);
        subscription.setCreatedDate(LocalDateTime.now());
        return pushNotificationRepository.save(subscription).getId();
    }

    @Transactional
    public void unsubscribe(String subscriptionId, String userId) {
        pushNotificationRepository.deleteByIdAndUser_Id(subscriptionId, userId);
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Async
    public void deliver(NotificationCreatedEvent event) {
        deliverToUser(event);
    }

    public int sendTestNotification(String userId) {
        return deliverToUser(new NotificationCreatedEvent(
                userId,
                TEST_NOTIFICATION_TITLE,
                TEST_NOTIFICATION_BODY,
                "0",
                LocalDateTime.now(),
                "push-notification-test",
                "/settings/notifications",
                TEST_NOTIFICATION_ICON,
                TEST_NOTIFICATION_ICON,
                Map.of()));
    }

    private int deliverToUser(NotificationCreatedEvent event) {
        if (!webPushClient.isConfigured()) {
            log.debug("Skipping Web Push delivery because VAPID is not configured");
            return 0;
        }
        String payload;
        try {
            Map<String, Object> data = new LinkedHashMap<>();
            data.put("title", event.title());
            data.put("body", event.body());
            data.put("type", event.type());
            data.put("link", StringUtils.hasText(event.link()) ? event.link() : null);
            data.put("icon", StringUtils.hasText(event.icon()) ? event.icon() : TEST_NOTIFICATION_ICON);
            data.put("badge", StringUtils.hasText(event.badge()) ? event.badge() : TEST_NOTIFICATION_ICON);
            data.put("uniqueKey", event.uniqueKey());
            data.put("time", event.time());
            payload = objectMapper.writeValueAsString(data);
        } catch (JsonProcessingException exception) {
            log.error("Failed to serialize Web Push notification for user {}", event.userId(), exception);
            return 0;
        }
        List<PushNotification> subscriptions = pushNotificationRepository.findAllByUser_Id(event.userId());
        int deliveryCount = 0;
        for (PushNotification subscription : subscriptions) {
            if (deliver(subscription, event.userId(), payload)) {
                deliveryCount++;
            }
        }
        return deliveryCount;
    }

    private boolean deliver(PushNotification subscription, String userId, String payload) {
        try {
            int status = webPushClient.send(subscription, payload);
            if (status == GONE || status == NOT_FOUND) {
                pushNotificationRepository.deleteByIdAndUser_Id(subscription.getId(), userId);
            } else if (status < 200 || status >= 300) {
                log.warn("Web Push service returned status {} for subscription {}", status, subscription.getId());
            } else {
                return true;
            }
        } catch (RuntimeException exception) {
            log.warn("Web Push delivery failed for subscription {}", subscription.getId(), exception);
        }
        return false;
    }

    private void validateSubscription(PushSubscriptionRequest request) {
        URI endpoint;
        try {
            endpoint = URI.create(request.endpoint());
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException("Push endpoint is invalid");
        }
        if (!"https".equalsIgnoreCase(endpoint.getScheme()) || !StringUtils.hasText(endpoint.getHost())) {
            throw new IllegalArgumentException("Push endpoint must be an absolute HTTPS URL");
        }
        byte[] publicKey = Base64.getUrlDecoder().decode(request.keys().p256dh());
        byte[] auth = Base64.getUrlDecoder().decode(request.keys().auth());
        if (publicKey.length != 65 || publicKey[0] != 4) {
            throw new IllegalArgumentException("p256dh key is invalid");
        }
        if (auth.length != 16) {
            throw new IllegalArgumentException("Auth key is invalid");
        }
    }

    private String truncate(String value, int maxLength) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        String normalized = value.trim();
        return normalized.length() <= maxLength ? normalized : normalized.substring(0, maxLength);
    }

    public static PushClientMetadata clientMetadata(Map<String, String> headers, String ip) {
        String userAgent = headers.get("user-agent");
        String browser = firstPresent(headers.get("sec-ch-ua"), userAgent);
        String mobileHint = headers.get("sec-ch-ua-mobile");
        String deviceType = "?1".equals(mobileHint)
                ? "mobile"
                : "?0".equals(mobileHint) ? "desktop" : Utils.detectDeviceType(userAgent);
        String os = firstPresent(unquote(headers.get("sec-ch-ua-platform")), Utils.detectOs(userAgent));
        return new PushClientMetadata(
                ip,
                browser,
                deviceType,
                null,
                unquote(headers.get("sec-ch-ua-model")),
                unquote(headers.get("sec-ch-ua-arch")),
                os);
    }

    private static String firstPresent(String first, String second) {
        return StringUtils.hasText(first) ? first : StringUtils.hasText(second) ? second : null;
    }

    private static String unquote(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        String normalized = value.trim();
        return normalized.length() >= 2 && normalized.startsWith("\"") && normalized.endsWith("\"")
                ? normalized.substring(1, normalized.length() - 1)
                : normalized;
    }
}
