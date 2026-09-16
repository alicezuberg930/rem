package server.rem.services;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
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
import server.rem.utils.exceptions.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
@Slf4j
public class PushNotificationService {
    private static final int GONE = 410;
    private static final int NOT_FOUND = 404;

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
        List<PushNotification> matches = pushNotificationRepository
                .findAllByEndpointOrderByCreatedDateDesc(request.endpoint());
        PushNotification subscription;
        if (matches.isEmpty()) {
            subscription = new PushNotification();
        } else {
            subscription = matches.getFirst();
            if (matches.size() > 1) {
                pushNotificationRepository.deleteAll(matches.subList(1, matches.size()));
            }
        }
        subscription.setUser(userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found")));
        subscription.setEndpoint(request.endpoint());
        subscription.setP256dh(request.keys().p256dh());
        subscription.setAuth(request.keys().auth());
        subscription.setIp(truncate(metadata.ip(), 45));
        subscription.setBrowser(truncate(metadata.browser(), 255));
        subscription.setDeviceType(truncate(metadata.deviceType(), 255));
        subscription.setDeviceVendor(truncate(metadata.deviceVendor(), 255));
        subscription.setDeviceModel(truncate(metadata.deviceModel(), 255));
        subscription.setCpu(truncate(metadata.cpu(), 255));
        subscription.setOs(truncate(metadata.os(), 255));
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
        if (!webPushClient.isConfigured()) {
            log.debug("Skipping Web Push delivery because VAPID is not configured");
            return;
        }
        String payload;
        try {
            payload = objectMapper.writeValueAsString(toPayload(event));
        } catch (JsonProcessingException exception) {
            log.error("Failed to serialize Web Push notification for user {}", event.userId(), exception);
            return;
        }
        List<PushNotification> subscriptions = pushNotificationRepository.findAllByUser_Id(event.userId());
        for (PushNotification subscription : subscriptions) {
            deliver(subscription, event.userId(), payload);
        }
    }

    private void deliver(PushNotification subscription, String userId, String payload) {
        try {
            int status = webPushClient.send(subscription, payload);
            if (status == GONE || status == NOT_FOUND) {
                pushNotificationRepository.deleteByIdAndUser_Id(subscription.getId(), userId);
            } else if (status < 200 || status >= 300) {
                log.warn("Web Push service returned status {} for subscription {}", status, subscription.getId());
            }
        } catch (RuntimeException exception) {
            log.warn("Web Push delivery failed for subscription {}", subscription.getId(), exception);
        }
    }

    private Map<String, Object> toPayload(NotificationCreatedEvent event) {
        Map<String, Object> data = new LinkedHashMap<>(event.data());
        data.put("time", event.time());
        if (event.uniqueKey() != null) {
            data.put("uniqueKey", event.uniqueKey());
        }
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("title", event.title());
        payload.put("body", event.body());
        payload.put("type", event.type());
        putIfPresent(payload, "link", event.link());
        putIfPresent(payload, "icon", event.icon());
        putIfPresent(payload, "badge", event.badge());
        payload.put("data", data);
        return payload;
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
        byte[] publicKey = decodeBase64Url(request.keys().p256dh(), "p256dh");
        byte[] auth = decodeBase64Url(request.keys().auth(), "auth");
        if (publicKey.length != 65 || publicKey[0] != 4) {
            throw new IllegalArgumentException("p256dh key is invalid");
        }
        if (auth.length != 16) {
            throw new IllegalArgumentException("Auth key is invalid");
        }
    }

    private byte[] decodeBase64Url(String value, String field) {
        try {
            return Base64.getUrlDecoder().decode(value);
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException(field + " key is invalid");
        }
    }

    private void putIfPresent(Map<String, Object> payload, String key, String value) {
        if (StringUtils.hasText(value)) {
            payload.put(key, value);
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
                : "?0".equals(mobileHint) ? "desktop" : detectDeviceType(userAgent);
        String os = firstPresent(unquote(headers.get("sec-ch-ua-platform")), detectOs(userAgent));
        return new PushClientMetadata(
                ip,
                browser,
                deviceType,
                null,
                unquote(headers.get("sec-ch-ua-model")),
                unquote(headers.get("sec-ch-ua-arch")),
                os);
    }

    private static String detectDeviceType(String userAgent) {
        if (!StringUtils.hasText(userAgent)) {
            return null;
        }
        String normalized = userAgent.toLowerCase(Locale.ROOT);
        if (normalized.contains("tablet") || normalized.contains("ipad")) {
            return "tablet";
        }
        if (normalized.contains("mobile") || normalized.contains("android") || normalized.contains("iphone")) {
            return "mobile";
        }
        return "desktop";
    }

    private static String detectOs(String userAgent) {
        if (!StringUtils.hasText(userAgent)) {
            return null;
        }
        String normalized = userAgent.toLowerCase(Locale.ROOT);
        if (normalized.contains("windows")) return "Windows";
        if (normalized.contains("android")) return "Android";
        if (normalized.contains("iphone") || normalized.contains("ipad")) return "iOS";
        if (normalized.contains("mac os")) return "macOS";
        if (normalized.contains("linux")) return "Linux";
        return null;
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
