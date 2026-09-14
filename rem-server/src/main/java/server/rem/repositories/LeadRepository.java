package server.rem.repositories;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

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

import server.rem.entities.Lead;
import server.rem.enums.LeadSource;
import server.rem.enums.LeadStatus;

@Repository
public interface LeadRepository extends JpaRepository<Lead, String>, JpaSpecificationExecutor<Lead> {
    @Override
    /**
     * Paginates leads matching a dynamic specification.
     *
     * @param spec filter definition
     * @param pageable paging request
     * @return paginated leads with contact and contact tag graph populated
     */
    @EntityGraph(attributePaths = {"contact", "contact.tag"})
    Page<Lead> findAll(Specification<Lead> spec, Pageable pageable);

    /**
     * Loads one lead by id constrained to a business tenant.
     *
     * @param id lead id
     * @param businessId owning business id
     * @return lead with contact and tag graph if found
     */
    @EntityGraph(attributePaths = {"contact", "contact.tag"})
    Optional<Lead> findByIdAndContact_Business_Id(String id, String businessId);

    /**
     * Loads all leads whose ids are in the provided list and belong to a business.
     *
     * @param ids lead ids
     * @param businessId owning business id
     * @return matching leads with contact/tag graph initialized
     */
    @EntityGraph(attributePaths = {"contact", "contact.tag"})
    List<Lead> findByIdInAndContact_Business_Id(Collection<String> ids, String businessId);

    /**
     * Returns a export-oriented slice of leads for a business.
     *
     * @param businessId owning business id
     * @param source optional source filter
     * @param status optional status filter
     * @param pageable paging request
     * @return slice of leads including contact/business/tag via fetch joins
     */
    @Query("""
            SELECT lead
            FROM Lead lead
            JOIN FETCH lead.contact contact
            JOIN FETCH contact.business business
            JOIN FETCH contact.tag tag
            WHERE business.id = :businessId
              AND (:source IS NULL OR lead.source = :source)
              AND (:status IS NULL OR lead.status = :status)
            """)
    Slice<Lead> findAllForExport(
            @Param("businessId") String businessId,
            @Param("source") LeadSource source,
            @Param("status") LeadStatus status,
            Pageable pageable
    );

    /**
     * Checks whether any lead uses the specified contact id.
     *
     * @param contactId contact id
     * @return true when at least one lead references the contact
     */
    boolean existsByContact_Id(String contactId);

    /**
     * Checks if a contact id is used by another lead (excluding a given lead id).
     *
     * @param contactId contact id
     * @param id lead id to exclude
     * @return true when another lead uses the same contact
     */
    boolean existsByContact_IdAndIdNot(String contactId, String id);
}
