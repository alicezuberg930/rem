package server.rem.services;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import server.rem.dtos.CustomPageResponse;
import server.rem.dtos.notification.CreateNotificationRequest;
import server.rem.dtos.notification.NotificationResponse;
import server.rem.dtos.notification.QueryNotification;
import server.rem.entities.BusinessUser;
import server.rem.entities.Notification;
import server.rem.events.NotificationCreatedEvent;
import server.rem.mappers.NotificationMapper;
import server.rem.repositories.BusinessUserRepository;
import server.rem.repositories.NotificationRepository;
import server.rem.utils.exceptions.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private static final int MAX_PAGE_SIZE = 100;

    private final NotificationRepository notificationRepository;
    private final BusinessUserRepository businessUserRepository;
    private final NotificationMapper notificationMapper;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public NotificationResponse create(CreateNotificationRequest request, String businessId) {
        BusinessUser target = businessUserRepository
                .findActiveByUserIdAndBusinessId(request.getToUserId(), businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification target user not found"));
        Notification notification = notificationRepository.save(notificationMapper.toEntity(
                request,
                target.getBusiness(),
                target.getUser()));
        eventPublisher.publishEvent(new NotificationCreatedEvent(
                target.getUser().getId(),
                notification.getTitle(),
                notification.getContent(),
                notification.getType(),
                notification.getTime(),
                notification.getUniqueKey(),
                request.getLink(),
                request.getIcon(),
                request.getBadge(),
                request.getData()));
        return notificationMapper.toResponse(notification);
    }

    @Transactional(readOnly = true)
    public CustomPageResponse<NotificationResponse> getAll(
            QueryNotification query,
            String businessId,
            String userId) {
        Pageable pageable = PageRequest.of(
                Math.max(query.getPage(), 0),
                Math.min(Math.max(query.getPageSize(), 1), MAX_PAGE_SIZE),
                Sort.by(Sort.Direction.DESC, "time").and(Sort.by(Sort.Direction.DESC, "id")));
        Page<Notification> notifications = query.getIsRead() == null
                ? notificationRepository.findAllByBusiness_IdAndToUser_Id(businessId, userId, pageable)
                : notificationRepository.findAllByBusiness_IdAndToUser_IdAndIsRead(
                        businessId,
                        userId,
                        query.getIsRead(),
                        pageable);
        return new CustomPageResponse<>(notifications.map(notificationMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(String businessId, String userId) {
        return notificationRepository.countByBusiness_IdAndToUser_IdAndIsRead(businessId, userId, false);
    }

    @Transactional
    public NotificationResponse markRead(String notificationId, String businessId, String userId) {
        Notification notification = notificationRepository
                .findByIdAndBusiness_IdAndToUser_Id(notificationId, businessId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        if (!notification.isRead()) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
        return notificationMapper.toResponse(notification);
    }

    @Transactional
    public int markAllRead(String businessId, String userId) {
        return notificationRepository.markAllRead(businessId, userId);
    }
}
