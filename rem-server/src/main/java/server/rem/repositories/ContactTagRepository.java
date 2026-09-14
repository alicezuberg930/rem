package server.rem.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import server.rem.entities.ContactTag;
 
import java.util.List;
 
@Repository
public interface ContactTagRepository extends JpaRepository<ContactTag, String> {
    @Override
    /**
     * Returns all contact tags with the owning business graph initialized.
     *
     * @return all contact tags
     */
    @EntityGraph(attributePaths = "business")
    List<ContactTag> findAll();

    /**
     * Returns contact tags filtered by active status.
     *
     * @param isActive active flag
     * @return tags that match the requested active state
     */
    @EntityGraph(attributePaths = "business")
    List<ContactTag> findByIsActive(Boolean isActive);

    @Override
    /**
     * Loads one tag by id with its business graph initialized.
     *
     * @param id tag id
     * @return matching tag if found
     */
    @EntityGraph(attributePaths = "business")
    Optional<ContactTag> findById(String id);

    /**
     * Checks whether a tag with this name already exists.
     *
     * @param name tag name
     * @return true when a duplicate name exists
     */
    boolean existsByName(String name);
}
