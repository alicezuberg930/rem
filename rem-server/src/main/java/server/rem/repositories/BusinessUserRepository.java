package server.rem.repositories;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import server.rem.entities.Business;
import server.rem.entities.BusinessUser;
import server.rem.entities.BusinessUserId;
import server.rem.entities.User;

public interface BusinessUserRepository extends JpaRepository<BusinessUser, BusinessUserId> {
    /**
     * Lists all user memberships for a business.
     *
     * @param business owning business
     * @return memberships with user graph initialized
     */
    @EntityGraph(attributePaths = "user")
    List<BusinessUser> findByBusiness(Business business);

    /**
     * Lists all business memberships for a user.
     *
     * @param user user entity
     * @return memberships joined to this user
     */
    List<BusinessUser> findByUser(User user);

    /**
     * Finds the membership row for one business-user pair.
     *
     * @param business owning business
     * @param user member user
     * @return membership if found
     */
    Optional<BusinessUser> findByBusinessAndUser(Business business, User user);

    /**
     * Loads one membership by userId and businessId including role and permissions.
     *
     * @param userId user id
     * @param businessId business id
     * @return matching membership if exists
     */
    @EntityGraph(attributePaths = { "role", "role.permissions" })
    @Query("SELECT bu FROM BusinessUser bu WHERE bu.id.userId = :userId AND bu.id.businessId = :businessId")
    Optional<BusinessUser> findByUserIdAndBusinessId(@Param("userId") String userId, @Param("businessId") String businessId);

    /**
     * Loads the active membership for a given user-business pair, including role graph.
     *
     * @param userId user id
     * @param businessId business id
     * @return active membership if found
     */
    @EntityGraph(attributePaths = { "business", "user", "role" })
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

    /**
     * Finds active user membership by business + email.
     *
     * @param email user email
     * @param businessId owning business id
     * @return active membership record with user relation, if found
     */
    @EntityGraph(attributePaths = "user")
    @Query("SELECT bu FROM BusinessUser bu WHERE bu.user.email = :email AND bu.id.businessId = :businessId")
    Optional<BusinessUser> findByUserEmailAndBusinessId(@Param("email") String email, @Param("businessId") String businessId);

    /**
     * Loads all active users in a business except the current user, for one-to-one chat use.
     *
     * @param businessId owning business id
     * @param currentUserId current user id
     * @return active chat users excluding the current user, ordered by name
     */
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

    /**
     * Loads all active users in a business for chat lists.
     *
     * @param businessId owning business id
     * @return active users ordered by fullname
     */
    @Query("""
            SELECT bu.user
            FROM BusinessUser bu
            WHERE bu.id.businessId = :businessId
              AND bu.isActive = true
            ORDER BY bu.user.fullname
            """)
    List<User> findActiveUsersByBusinessId(@Param("businessId") String businessId);

    /**
     * Loads memberships in a business with user and role initialized.
     *
     * @param businessId owning business id
     * @return memberships ordered by user name
     */
    @EntityGraph(attributePaths = { "user", "role" })
    @Query("""
            SELECT bu
            FROM BusinessUser bu
            WHERE bu.id.businessId = :businessId
            ORDER BY bu.user.fullname
            """)
    List<BusinessUser> findUsersByBusinessId(@Param("businessId") String businessId);

    /**
     * Gets active users by user id list inside a business.
     *
     * @param businessId owning business id
     * @param userIds target user ids
     * @return active users in the business matching userIds
     */
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
