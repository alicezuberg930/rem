package server.rem.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import server.rem.entities.CalendarBooking;

public interface CalendarBookingRepository extends JpaRepository<CalendarBooking, String> {
    /**
     * Lists bookings for one business, including service staff, correspondent, contact and tag graphs.
     *
     * @param businessId owning business id
     * @return bookings for the business with related entities initialized
     */
    @EntityGraph(attributePaths = { "business", "serviceStaff", "correspondent", "contact", "contact.tag" })
    List<CalendarBooking> findAllByBusinessId(String businessId);

    /**
     * Loads one booking by id and business id with related entities initialized.
     *
     * @param id booking id
     * @param businessId owning business id
     * @return matching booking if found
     */
    @EntityGraph(attributePaths = { "business", "serviceStaff", "correspondent", "contact", "contact.tag" })
    Optional<CalendarBooking> findByIdAndBusinessId(String id, String businessId);
}
