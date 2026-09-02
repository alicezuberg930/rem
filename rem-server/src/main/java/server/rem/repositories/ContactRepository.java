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

import server.rem.entities.Contact;
import server.rem.enums.ContactType;

@Repository
public interface ContactRepository extends JpaRepository<Contact, String>, JpaSpecificationExecutor<Contact> {
    @Override
    @EntityGraph(attributePaths = {"business", "tag", "customerGroup"})
    Page<Contact> findAll(Specification<Contact> spec, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"business", "tag", "customerGroup"})
    Optional<Contact> findById(String id);

    @Query("""
            SELECT contact
            FROM Contact contact
            JOIN FETCH contact.business business
            JOIN FETCH contact.tag tag
            LEFT JOIN FETCH contact.customerGroup customerGroup
            WHERE business.id = :businessId
              AND (:type IS NULL OR contact.type = :type)
              AND (:customerGroupId IS NULL OR customerGroup.id = :customerGroupId)
            """)
    Slice<Contact> findAllForExport(
            @Param("businessId") String businessId,
            @Param("type") ContactType type,
            @Param("customerGroupId") String customerGroupId,
            Pageable pageable
    );

    boolean existsByEmailAndBusinessId(String email, String businessId);
}
