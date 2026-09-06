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
    @EntityGraph(attributePaths = {"contact", "contact.business", "contact.tag", "customerGroup"})
    Page<Customer> findAll(Specification<Customer> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"contact", "contact.business", "contact.tag", "customerGroup"})
    Optional<Customer> findByIdAndContact_Business_Id(String id, String businessId);

    @EntityGraph(attributePaths = {"contact", "contact.business", "contact.tag", "customerGroup"})
    Optional<Customer> findByContact_Id(String contactId);

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

    boolean existsByContact_Id(String contactId);

    boolean existsByContact_IdAndIdNot(String contactId, String id);
}
