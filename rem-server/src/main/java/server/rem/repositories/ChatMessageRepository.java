package server.rem.repositories;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import server.rem.entities.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, String> {

    /**
     * Gets conversation messages between two users inside one business.
     *
     * @param businessId owning business id
     * @param currentUserId current user id
     * @param otherUserId counterpart user id
     * @param pageable paging request (used as limit/offset)
     * @return latest-first message list for the 1:1 conversation
     */
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

    /**
     * Gets messages in a group conversation for a business.
     *
     * @param businessId owning business id
     * @param groupId target group id
     * @param pageable paging request (used as limit/offset)
     * @return latest-first message list for the group conversation
     */
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
