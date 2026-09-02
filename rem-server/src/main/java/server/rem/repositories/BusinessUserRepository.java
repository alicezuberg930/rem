package server.rem.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import server.rem.entities.Business;
import server.rem.entities.BusinessUser;
import server.rem.entities.BusinessUserId;
import server.rem.entities.User;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface BusinessUserRepository extends JpaRepository<BusinessUser, BusinessUserId> {
    List<BusinessUser> findByBusiness(Business business);

    List<BusinessUser> findByUser(User user);

    Optional<BusinessUser> findByBusinessAndUser(Business business, User user);

    @Query("SELECT bu FROM BusinessUser bu LEFT JOIN FETCH bu.role r LEFT JOIN FETCH r.permissions WHERE bu.id.userId = :userId AND bu.id.businessId = :businessId")
    Optional<BusinessUser> findByUserIdAndBusinessId(@Param("userId") String userId, @Param("businessId") String businessId);

    @Query("""
            SELECT bu
            FROM BusinessUser bu
            WHERE bu.id.userId = :userId
              AND bu.id.businessId = :businessId
              AND bu.isActive = true
            """)
    Optional<BusinessUser> findActiveByUserIdAndBusinessId(
            @Param("userId") String userId,
            @Param("businessId") String businessId);

    @Query("SELECT bu FROM BusinessUser bu LEFT JOIN FETCH bu.user u WHERE u.email = :email AND bu.id.businessId = :businessId")
    Optional<BusinessUser> findByUserEmailAndBusinessId(@Param("email") String email, @Param("businessId") String businessId);

    @Query("""
            SELECT bu.user
            FROM BusinessUser bu
            WHERE bu.id.businessId = :businessId
              AND bu.id.userId <> :currentUserId
              AND bu.isActive = true
            ORDER BY bu.user.fullname
            """)
    List<User> findActiveChatUsers(
            @Param("businessId") String businessId,
            @Param("currentUserId") String currentUserId);

    @Query("""
            SELECT bu.user
            FROM BusinessUser bu
            WHERE bu.id.businessId = :businessId
              AND bu.isActive = true
            ORDER BY bu.user.fullname
            """)
    List<User> findActiveUsersByBusinessId(@Param("businessId") String businessId);

    @Query("""
            SELECT bu.user
            FROM BusinessUser bu
            WHERE bu.id.businessId = :businessId
              AND bu.id.userId IN :userIds
              AND bu.isActive = true
            """)
    List<User> findActiveUsersByBusinessIdAndUserIdIn(
            @Param("businessId") String businessId,
            @Param("userIds") Collection<String> userIds);
}
