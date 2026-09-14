package server.rem.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import server.rem.entities.Group;

@Repository
public interface GroupRepository extends JpaRepository<Group, String> {
    /**
     * Loads one chat group by id and business id, including members.
     *
     * @param id group id
     * @param businessId owning business id
     * @return matching group with member collection initialized
     */
    @EntityGraph(attributePaths = "members")
    Optional<Group> findByIdAndBusinessId(String id, String businessId);

    /**
     * Loads all groups for a business that include a specific user.
     *
     * @param businessId owning business id
     * @param userId user id
     * @return groups containing the user, ordered by createdAt descending
     */
    @EntityGraph(attributePaths = "members")
    @Query("""
            SELECT DISTINCT chatGroup
            FROM ChatGroup chatGroup
            JOIN chatGroup.members member
            WHERE chatGroup.business.id = :businessId
              AND member.id = :userId
            ORDER BY chatGroup.createdAt DESC
            """)
    List<Group> findAllForMember(
            @Param("businessId") String businessId,
            @Param("userId") String userId);
}
