package server.rem.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import server.rem.entities.Notification;

public interface NotificationRepository extends JpaRepository<Notification, String> {
    Page<Notification> findAllByBusiness_IdAndToUser_Id(
            String businessId,
            String userId,
            Pageable pageable);

    Page<Notification> findAllByBusiness_IdAndToUser_IdAndIsRead(
            String businessId,
            String userId,
            boolean isRead,
            Pageable pageable);

    Optional<Notification> findByIdAndBusiness_IdAndToUser_Id(
            String id,
            String businessId,
            String userId);

    long countByBusiness_IdAndToUser_IdAndIsRead(String businessId, String userId, boolean isRead);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
            UPDATE Notification notification
            SET notification.isRead = true
            WHERE notification.business.id = :businessId
              AND notification.toUser.id = :userId
              AND notification.isRead = false
            """)
    int markAllRead(
            @Param("businessId") String businessId,
            @Param("userId") String userId);
}
