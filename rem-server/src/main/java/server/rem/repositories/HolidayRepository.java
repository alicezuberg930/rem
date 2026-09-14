package server.rem.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import server.rem.entities.Business;
import server.rem.entities.Holiday;

public interface HolidayRepository extends JpaRepository<Holiday, String> {
    /**
     * Returns holidays for one business within a date range.
     *
     * @param business owning business
     * @param startDate range start date (inclusive)
     * @param endDate range end date (inclusive)
     * @return holidays that fall inside the provided range
     */
    List<Holiday> findByBusinessAndDateBetween(Business business, LocalDate startDate, LocalDate endDate);
}
