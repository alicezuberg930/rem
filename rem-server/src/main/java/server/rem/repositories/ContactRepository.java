package server.rem.repositories;

import java.util.Optional;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import server.rem.entities.Contact;
import server.rem.enums.ContactType;

@Repository
public interface ContactRepository extends JpaRepository<Contact, String>, JpaSpecificationExecutor<Contact> {
    @Override
    /**
     * Gets a paged list of contacts matching a dynamic filter.
     *
     * @param spec filter definition
     * @param pageable paging request
     * @return paginated contacts with tag graph initialized
     */
    @EntityGraph(attributePaths = "tag")
    Page<Contact> findAll(Specification<Contact> spec, Pageable pageable);

    @Override
    /**
     * Loads a contact by id with business and tag relations initialized.
     *
     * @param id contact id
     * @return matching contact with business/tag graph if found
     */
    @EntityGraph(attributePaths = {"business", "tag"})
    Optional<Contact> findById(String id);

    /**
     * Loads a contact by id only if it belongs to the given business.
     *
     * @param id contact id
     * @param businessId owning business id
     * @return matching contact (tag included) for the business, or empty
     */
    @EntityGraph(attributePaths = "tag")
    Optional<Contact> findByIdAndBusinessId(String id, String businessId);

    @Override
    /**
     * Loads all contacts for a list of ids using id-only input.
     *
     * @param ids contact ids
     * @return contacts found with tag graph initialized
     */
    @EntityGraph(attributePaths = "tag")
    List<Contact> findAllById(Iterable<String> ids);

    /**
     * Returns a slice of contacts prepared for export.
     *
     * @param businessId owning business id
     * @param type optional contact type filter
     * @param pageable paging request
     * @return export-ready slice with business and tag fetched
     */
    @Query("""
            SELECT contact
            FROM Contact contact
            JOIN FETCH contact.business business
            JOIN FETCH contact.tag tag
            WHERE business.id = :businessId
              AND (:type IS NULL OR contact.type = :type)
            """)
    Slice<Contact> findAllForExport(
            @Param("businessId") String businessId,
            @Param("type") ContactType type,
            Pageable pageable
    );

    /**
     * Checks if a contact exists for an email within one business.
     *
     * @param email contact email
     * @param businessId owning business id
     * @return true when a match exists
     */
    boolean existsByEmailAndBusinessId(String email, String businessId);
}
