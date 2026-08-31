package server.rem.controllers;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import server.rem.annotations.RequestUser;
import server.rem.dtos.APIResponse;
import server.rem.dtos.chat.ChatMessageResponse;
import server.rem.dtos.chat.ChatUserResponse;
import server.rem.services.ChatService;

@RestController
@RequestMapping("/chats")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    @GetMapping("/users")
    public ResponseEntity<APIResponse<List<ChatUserResponse>>> getChatUsers(
            @RequestUser String userId,
            @RequestAttribute("businessId") String businessId) {
        return ResponseEntity.ok(APIResponse.success(
                200,
                "Chat users retrieved successfully",
                chatService.getChatUsers(userId, businessId)));
    }

    @GetMapping("/{otherUserId}/messages")
    public ResponseEntity<APIResponse<List<ChatMessageResponse>>> getConversation(
            @RequestUser String userId,
            @RequestAttribute("businessId") String businessId,
            @PathVariable String otherUserId,
            @RequestParam(defaultValue = "100") int limit) {
        return ResponseEntity.ok(APIResponse.success(
                200,
                "Chat messages retrieved successfully",
                chatService.getConversation(userId, otherUserId, businessId, limit)));
    }
}
