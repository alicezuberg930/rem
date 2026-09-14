package server.rem.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import server.rem.entities.Attendance;
import server.rem.entities.Business;
import server.rem.entities.User;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, String>, JpaSpecificationExecutor<Attendance> {
    @Override
    /**
     * Returns a paginated list of attendance records matching a specification.
     *
     * @param spec filter definition
     * @param pageable paging request
     * @return paginated attendance rows with user graph initialized
     */
    @EntityGraph(attributePaths = "user")
    Page<Attendance> findAll(Specification<Attendance> spec, Pageable pageable);

    /**
     * Finds a single attendance record for one business-user-date tuple.
     *
     * @param business owning business
     * @param user employee/user
     * @param date attendance date
     * @return matching attendance if found
     */
    Optional<Attendance> findByBusinessAndUserAndDate(Business business, User user, LocalDate date);

    /**
     * Checks whether an attendance record exists for one business-user-date tuple.
     *
     * @param business owning business
     * @param user employee/user
     * @param date attendance date
     * @return true when a record exists
     */
    boolean existsByBusinessAndUserAndDate(Business business, User user, LocalDate date);

    /**
     * Loads attendance records for one user and business within a date window.
     *
     * @param user employee/user
     * @param business owning business
     * @param startDate window start date (inclusive)
     * @param endDate window end date (inclusive)
     * @return attendance entries in the date range
     */
    List<Attendance> findByUserAndBusinessAndDateBetween(User user, Business business, LocalDate startDate, LocalDate endDate);
}
