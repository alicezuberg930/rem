package server.rem.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import server.rem.entities.PushNotification;

public interface PushNotificationRepository extends JpaRepository<PushNotification, String> {
    List<PushNotification> findAllByEndpointOrderByCreatedDateDesc(String endpoint);

    List<PushNotification> findAllByUser_Id(String userId);

    @Transactional
    long deleteByIdAndUser_Id(String id, String userId);
}
