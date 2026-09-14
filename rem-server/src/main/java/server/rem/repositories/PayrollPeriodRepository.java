package server.rem.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import server.rem.entities.PayrollPeriod;

public interface PayrollPeriodRepository extends JpaRepository<PayrollPeriod, String>, JpaSpecificationExecutor<PayrollPeriod> {
    @Override
    /**
     * Loads one payroll period by id with its owning business eagerly populated.
     *
     * @param id payroll period id
     * @return payroll period and business graph if found
     */
    @EntityGraph(attributePaths = "business")
    Optional<PayrollPeriod> findById(String id);
}
