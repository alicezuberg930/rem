package server.rem.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import server.rem.entities.PayrollItem;
import server.rem.entities.PayrollPeriod;
import server.rem.entities.User;

public interface PayrollItemRepository extends JpaRepository<PayrollItem, String>, JpaSpecificationExecutor<PayrollItem> {
    @EntityGraph(attributePaths = { "payrollPeriod", "user", "approver" })
    Page<PayrollItem> findByBusinessId(String businessId, Pageable pageable);

    List<PayrollItem> findByPayrollPeriod(PayrollPeriod period);
    
    Optional<PayrollItem> findByPayrollPeriodAndUser(PayrollPeriod period, User user);
}
