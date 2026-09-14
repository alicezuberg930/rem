package server.rem.repositories;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import server.rem.entities.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    /**
     * Loads a user by id together with business memberships, roles, and permissions.
     *
     * @param id user id
     * @return the user and related membership graph if found, otherwise {@link Optional#empty()}
     */
    @EntityGraph(attributePaths = {
            "businessUsers",
            "businessUsers.business",
            "businessUsers.role",
            "businessUsers.role.permissions"
    })
    @Query("SELECT user FROM User user WHERE user.id = :id")
    Optional<User> findProfileById(@Param("id") String id);

    /**
     * Loads a user by id together with memberships and role references.
     *
     * @param id user id
     * @return user with role associations if found, otherwise {@link Optional#empty()}
     */
    @EntityGraph(attributePaths = { "businessUsers", "businessUsers.role" })
    @Query("SELECT user FROM User user WHERE user.id = :id")
    Optional<User> findWithMembershipRolesById(@Param("id") String id);

    /**
     * Looks up a user by email address.
     *
     * @param email user email
     * @return matching user if exists, otherwise {@link Optional#empty()}
     */
    Optional<User> findByEmail(String email);

    /**
     * Looks up a user by phone number.
     *
     * @param phone user phone
     * @return matching user if exists, otherwise {@link Optional#empty()}
     */
    Optional<User> findByPhone(String phone);

    /**
     * Checks whether a user with the given email exists.
     *
     * @param email user email
     * @return true when at least one user has this email
     */
    boolean existsByEmail(String email);

    /**
     * Checks whether a user with the given phone exists.
     *
     * @param phone user phone
     * @return true when at least one user has this phone
     */
    boolean existsByPhone(String phone);
}
