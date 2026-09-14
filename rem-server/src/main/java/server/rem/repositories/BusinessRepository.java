package server.rem.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import server.rem.entities.Business;
import server.rem.entities.User;

import java.util.List;

public interface BusinessRepository extends JpaRepository<Business, String> {
    /**
     * Returns all businesses owned by a user.
     *
     * @param user owner user
     * @return list of businesses where the user is the owner
     */
    List<Business> findAllByOwner(User user);

}
