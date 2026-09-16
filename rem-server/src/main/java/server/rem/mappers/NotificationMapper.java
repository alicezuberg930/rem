package server.rem.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;

import server.rem.dtos.notification.CreateNotificationRequest;
import server.rem.dtos.notification.NotificationResponse;
import server.rem.entities.Business;
import server.rem.entities.Notification;
import server.rem.entities.User;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface NotificationMapper {
    @Mapping(target = "business", source = "business")
    @Mapping(target = "toUser", source = "toUser")
    @Mapping(target = "title", source = "request.title", qualifiedByName = "trim")
    @Mapping(target = "content", source = "request.content", qualifiedByName = "trim")
    @Mapping(target = "type", source = "request.type", qualifiedByName = "trim")
    @Mapping(target = "uniqueKey", source = "request.uniqueKey", qualifiedByName = "trimToNull")
    @Mapping(target = "time", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "isRead", constant = "false")
    Notification toEntity(CreateNotificationRequest request, Business business, User toUser);

    @Mapping(target = "businessId", source = "business.id")
    @Mapping(target = "toUserId", source = "toUser.id")
    @Mapping(target = "isRead", expression = "java(notification.isRead())")
    NotificationResponse toResponse(Notification notification);

    @Named("trim")
    default String trim(String value) {
        return value == null ? null : value.trim();
    }

    @Named("trimToNull")
    default String trimToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
