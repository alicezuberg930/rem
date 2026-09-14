package server.rem.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import server.rem.entities.Business;
import server.rem.entities.CalendarEvent;

public interface CalendarEventRepository extends JpaRepository<CalendarEvent, String>, JpaSpecificationExecutor<CalendarEvent> {
    /**
     * Returns events for a business within a date window.
     *
     * @param business owning business
     * @param starDate window start date (inclusive)
     * @param endDate window end date (inclusive)
     * @return events created by the business in the requested range
     */
    @EntityGraph(attributePaths = { "business", "createdBy" })
    List<CalendarEvent> findByBusinessAndStartDateGreaterThanEqualAndEndDateLessThanEqual(Business business, LocalDate starDate, LocalDate endDate);
}
