package server.rem.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import server.rem.entities.Allowance;
import server.rem.entities.Business;

public interface AllowanceRepository extends JpaRepository<Allowance, String>, JpaSpecificationExecutor<Allowance> {
    /**
     * Returns allowances for one business, filtered by active flag.
     *
     * @param business owning business
     * @param isActive active state filter
     * @return matching allowances for that business
     */
    List<Allowance> findByBusinessAndIsActive(Business business, boolean isActive);
}
