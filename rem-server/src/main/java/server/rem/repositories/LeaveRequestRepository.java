package server.rem.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import server.rem.entities.*;
import server.rem.enums.LeaveStatus;
import server.rem.enums.LeaveType;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, String>, JpaSpecificationExecutor<LeaveRequest> {
    @Override
    /**
     * Returns a paged list of leave requests matching the given specification.
     *
     * @param spec filter definition
     * @param pageable paging request
     * @return paginated leave requests with business/user/approver initialized
     */
    @EntityGraph(attributePaths = { "business", "user", "approver" })
    Page<LeaveRequest> findAll(Specification<LeaveRequest> spec, Pageable pageable);

    /**
     * Gets all leave requests created by one user.
     *
     * @param user employee/user
     * @return leave list for that user with business/user/approver graph loaded
     */
    @EntityGraph(attributePaths = { "business", "user", "approver" })
    List<LeaveRequest> findAllByUser(User user);

    @Override
    /**
     * Loads a leave request by id with business/user/approver graph pre-fetched.
     *
     * @param id leave request id
     * @return matching leave request if found
     */
    @EntityGraph(attributePaths = { "business", "user", "approver" })
    Optional<LeaveRequest> findById(String id);

    /**
     * Finds one leave request by user, business, type, and status.
     *
     * @param user employee/user
     * @param business owning business
     * @param unpaid leave type filter
     * @param approved status filter
     * @return matching leave request if it exists
     */
    Optional<LeaveRequest> findByUserAndBusinessAndTypeAndStatus(User user, Business business, LeaveType unpaid, LeaveStatus approved);

    /**
     * Returns overlapping leave requests for a user/business/type/status within a date range.
     *
     * @param user employee/user
     * @param business owning business
     * @param type leave type
     * @param status leave status
     * @param startDate start of period (inclusive)
     * @param endDate end of period (inclusive)
     * @return leave requests within the requested window
     */
    List<LeaveRequest> findByUserAndBusinessAndTypeAndStatusAndStartDateGreaterThanEqualAndEndDateLessThanEqual(User user, Business business, LeaveType type, LeaveStatus status, LocalDate startDate, LocalDate endDate);
}
