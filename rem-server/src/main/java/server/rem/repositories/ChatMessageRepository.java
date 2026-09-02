package server.rem.repositories;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import server.rem.entities.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, String> {

    @Query("""
            SELECT message
            FROM ChatMessage message
            WHERE message.business.id = :businessId
              AND ((message.sender.id = :currentUserId AND message.recipient.id = :otherUserId)
                OR (message.sender.id = :otherUserId AND message.recipient.id = :currentUserId))
            ORDER BY message.createdAt DESC, message.id DESC
            """)
    List<ChatMessage> findConversation(
            @Param("businessId") String businessId,
            @Param("currentUserId") String currentUserId,
            @Param("otherUserId") String otherUserId,
            Pageable pageable);

    @Query("""
            SELECT message
            FROM ChatMessage message
            WHERE message.business.id = :businessId
              AND message.group.id = :groupId
            ORDER BY message.createdAt DESC, message.id DESC
            """)
    List<ChatMessage> findGroupConversation(
            @Param("businessId") String businessId,
            @Param("groupId") String groupId,
            Pageable pageable);
}
