package server.rem.mappers;

import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;
import server.rem.dtos.chat.ChatMessageRequest;
import server.rem.dtos.chat.ChatMessageResponse;
import server.rem.dtos.chat.ChatUserResponse;
import server.rem.entities.Business;
import server.rem.entities.ChatMessage;
import server.rem.entities.User;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ChatMapper {
    @Mapping(target = "business", source = "business")
    @Mapping(target = "sender", source = "sender")
    @Mapping(target = "recipient", source = "recipient")
    @Mapping(target = "content", source = "request.content", qualifiedByName = "trim")
    ChatMessage toEntity(
            ChatMessageRequest request,
            Business business,
            User sender,
            User recipient);

    @Named("trim")
    default String trim(String value) {
        return value == null ? null : value.trim();
    }

    @Mapping(target = "type", constant = "MESSAGE")
    @Mapping(target = "senderId", source = "sender.id")
    @Mapping(target = "recipientId", source = "recipient.id")
    ChatMessageResponse toMessageResponse(ChatMessage message);

    List<ChatMessageResponse> toMessageResponses(List<ChatMessage> messages);

    ChatUserResponse toUserResponse(User user);

    List<ChatUserResponse> toUserResponses(List<User> users);
}
