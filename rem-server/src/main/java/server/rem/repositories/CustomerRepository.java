package server.rem.repositories;

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

import server.rem.entities.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String>, JpaSpecificationExecutor<Customer> {
    @Override
    /**
     * Gets a paged list of customers using dynamic filters.
     *
     * @param spec filter definition
     * @param pageable paging request
     * @return paginated customers with contact, tag, and customer group graph populated
     */
    @EntityGraph(attributePaths = {"contact", "contact.tag", "customerGroup"})
    Page<Customer> findAll(Specification<Customer> spec, Pageable pageable);

    /**
     * Loads one customer by id and validates tenant/business ownership.
     *
     * @param id customer id
     * @param businessId owning business id
     * @return matching customer with contact/tag/group graph
     */
    @EntityGraph(attributePaths = {"contact", "contact.tag", "customerGroup"})
    Optional<Customer> findByIdAndContact_Business_Id(String id, String businessId);

    /**
     * Finds a customer by linked contact id.
     *
     * @param contactId contact id
     * @return matching customer with graph loaded
     */
    @EntityGraph(attributePaths = {"contact", "contact.tag", "customerGroup"})
    Optional<Customer> findByContact_Id(String contactId);

    /**
     * Returns a export-oriented slice of customers by business and optional customer group.
     *
     * @param businessId owning business id
     * @param customerGroupId optional group id, or "none" for ungrouped customers
     * @param pageable paging request
     * @return export data slice with full contact and group graph fetched
     */
    @Query("""
            SELECT customer
            FROM Customer customer
            JOIN FETCH customer.contact contact
            JOIN FETCH contact.business business
            JOIN FETCH contact.tag tag
            LEFT JOIN FETCH customer.customerGroup customerGroup
            WHERE business.id = :businessId
              AND (
                    :customerGroupId IS NULL
                    OR (:customerGroupId = 'none' AND customer.customerGroup IS NULL)
                    OR customerGroup.id = :customerGroupId
                  )
            """)
    Slice<Customer> findAllForExport(
            @Param("businessId") String businessId,
            @Param("customerGroupId") String customerGroupId,
            Pageable pageable
    );

    /**
     * Checks if a customer already exists for the given contact id.
     *
     * @param contactId contact id
     * @return true when at least one customer references this contact
     */
    boolean existsByContact_Id(String contactId);

    /**
     * Checks if a contact id is already used by another customer.
     *
     * @param contactId contact id
     * @param id customer id to exclude
     * @return true when another customer references the same contact
     */
    boolean existsByContact_IdAndIdNot(String contactId, String id);
}
