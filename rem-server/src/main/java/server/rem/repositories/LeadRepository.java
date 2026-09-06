package server.rem.repositories;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import server.rem.entities.Lead;

@Repository
public interface LeadRepository extends JpaRepository<Lead, String>, JpaSpecificationExecutor<Lead> {
    @Override
    @EntityGraph(attributePaths = {"contact", "contact.business", "contact.tag"})
    Page<Lead> findAll(Specification<Lead> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"contact", "contact.business", "contact.tag"})
    Optional<Lead> findByIdAndContact_Business_Id(String id, String businessId);

    @EntityGraph(attributePaths = {"contact", "contact.business", "contact.tag"})
    List<Lead> findByIdInAndContact_Business_Id(Collection<String> ids, String businessId);

    boolean existsByContact_Id(String contactId);

    boolean existsByContact_IdAndIdNot(String contactId, String id);
}
