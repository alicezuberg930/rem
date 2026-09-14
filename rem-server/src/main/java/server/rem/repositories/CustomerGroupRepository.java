package server.rem.repositories;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import server.rem.entities.Business;
import server.rem.entities.CustomerGroup;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerGroupRepository extends JpaRepository<CustomerGroup, String> {
    /**
     * Lists all customer groups under one business.
     *
     * @param business owning business
     * @return groups for that business, with business graph initialized
     */
    @EntityGraph(attributePaths = { "business" })
    List<CustomerGroup> findByBusiness(Business business);

    /**
     * Loads one customer group by id with business graph pre-fetched.
     *
     * @param id customer group id
     * @return matching customer group if exists
     */
    @EntityGraph(attributePaths = { "business" })
    Optional<CustomerGroup> findById(String id);

    /**
     * Checks uniqueness by name within a business.
     *
     * @param name group name
     * @param businessId owning business id
     * @return true when a group with this name exists for the business
     */
    boolean existsByNameAndBusinessId(String name, String businessId);
}
