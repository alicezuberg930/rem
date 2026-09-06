package server.rem.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
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

    boolean existsByContact_Id(String contactId);

    boolean existsByContact_IdAndIdNot(String contactId, String id);
}
