package server.rem.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import server.rem.entities.PayrollItem;
import server.rem.entities.PayrollPeriod;
import server.rem.entities.User;

public interface PayrollItemRepository extends JpaRepository<PayrollItem, String>, JpaSpecificationExecutor<PayrollItem> {
    /**
     * Loads a page of payroll items for a business.
     *
     * @param businessId owning business id
     * @param pageable paging request
     * @return paginated payroll items with payroll period, user and approver graphs
     */
    @EntityGraph(attributePaths = { "payrollPeriod", "user", "approver" })
    Page<PayrollItem> findByBusinessId(String businessId, Pageable pageable);

    /**
     * Streams payroll items for a business as a slice, useful for incremental loading.
     *
     * @param businessId owning business id
     * @param pageable paging request
     * @return slice of payroll items with related business, period, user, and approver loaded
     */
    @EntityGraph(attributePaths = { "business", "payrollPeriod", "user", "approver" })
    Slice<PayrollItem> findAllByBusinessId(String businessId, Pageable pageable);

    /**
     * Returns all payroll items under a payroll period.
     *
     * @param period payroll period reference
     * @return all items that belong to the given period
     */
    List<PayrollItem> findByPayrollPeriod(PayrollPeriod period);
    
    /**
     * Finds a payroll item for a specific payroll period and user.
     *
     * @param period payroll period reference
     * @param user employee/user
     * @return matching payroll item with related graph, if any
     */
    @EntityGraph(attributePaths = { "business", "payrollPeriod", "user", "approver" })
    Optional<PayrollItem> findByPayrollPeriodAndUser(PayrollPeriod period, User user);
}
