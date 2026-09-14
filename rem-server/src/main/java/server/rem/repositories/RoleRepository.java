package server.rem.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import server.rem.entities.Role;

public interface RoleRepository extends JpaRepository<Role, String> {
    /**
     * Loads a role by its unique name.
     *
     * @param name role name
     * @return matching role if found
     */
    Optional<Role> findByName(String name);
}
