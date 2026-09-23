package server.rem.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import server.rem.annotations.RequestUser;
import server.rem.dtos.APIResponse;
import server.rem.dtos.CustomPageResponse;
import server.rem.dtos.notification.NotificationResponse;
import server.rem.dtos.notification.PushClientMetadata;
import server.rem.dtos.notification.PushSubscriptionRequest;
import server.rem.dtos.notification.QueryNotification;
import server.rem.services.NotificationService;
import server.rem.services.PushNotificationService;
import server.rem.utils.Utils;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    private final PushNotificationService pushNotificationService;

    @GetMapping
    public ResponseEntity<APIResponse<CustomPageResponse<NotificationResponse>>> getAll(
            @ModelAttribute QueryNotification query,
            @RequestAttribute("businessId") String businessId,
            @RequestUser String userId) {
        return ResponseEntity.ok(APIResponse.success(
                200,
                "Notifications retrieved",
                notificationService.getAll(query, businessId, userId)));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<APIResponse<Long>> getUnreadCount(
            @RequestAttribute("businessId") String businessId,
            @RequestUser String userId) {
        return ResponseEntity.ok(APIResponse.success(
                200,
                "Unread notification count retrieved",
                notificationService.getUnreadCount(businessId, userId)));
    }

    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<APIResponse<NotificationResponse>> markRead(
            @PathVariable String notificationId,
            @RequestAttribute("businessId") String businessId,
            @RequestUser String userId) {
        return ResponseEntity.ok(APIResponse.success(
                200,
                "Notification marked as read",
                notificationService.markRead(notificationId, businessId, userId)));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<APIResponse<Integer>> markAllRead(
            @RequestAttribute("businessId") String businessId,
            @RequestUser String userId) {
        return ResponseEntity.ok(APIResponse.success(
                200,
                "Notifications marked as read",
                notificationService.markAllRead(businessId, userId)));
    }

    @PostMapping("/push-notification/subscribe")
    public ResponseEntity<APIResponse<String>> subscribe(
            @Valid @RequestBody PushSubscriptionRequest request,
            @RequestUser String userId,
            HttpServletRequest httpRequest) {
        PushClientMetadata metadata = PushNotificationService.clientMetadata(
                Utils.extractHeaders(httpRequest),
                httpRequest.getRemoteAddr());
        return ResponseEntity.ok(APIResponse.success(
                201,
                "Push notification subscribed",
                pushNotificationService.subscribe(userId, request, metadata)));
    }

    @PostMapping("/push-notification/test")
    public ResponseEntity<APIResponse<Integer>> sendTestNotification(@RequestUser String userId) {
        int deliveryCount = pushNotificationService.sendTestNotification(userId);
        String message = deliveryCount > 0
                ? "Test notification sent"
                : "Test notification could not be delivered";
        return ResponseEntity.ok(APIResponse.success(200, message, deliveryCount));
    }

    @DeleteMapping("/push-notification/unsubscribe/{subscriptionId}")
    public ResponseEntity<APIResponse<Void>> unsubscribe(
            @PathVariable String subscriptionId,
            @RequestUser String userId) {
        pushNotificationService.unsubscribe(subscriptionId, userId);
        return ResponseEntity.ok(APIResponse.success(
                200,
                "Push notification unsubscribed",
                null));
    }
}
