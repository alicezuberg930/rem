package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import server.rem.dtos.calendar_event.QueryCalendarEvent;
import server.rem.entities.Business;
import server.rem.entities.CalendarEvent;
import server.rem.repositories.BusinessRepository;
import server.rem.repositories.CalendarEventRepository;
import server.rem.repositories.UserRepository;

@ExtendWith(MockitoExtension.class)
class CalendarEventServiceTests {
    @Mock
    private CalendarEventRepository calendarEventRepository;
    @Mock
    private BusinessRepository businessRepository;
    @Mock
    private UserRepository userRepository;

    private CalendarEventService calendarEventService;

    @BeforeEach
    void setUp() {
        calendarEventService = new CalendarEventService(calendarEventRepository, businessRepository, userRepository);
    }

    @Test
    void returnsEventsWithinRequestedDateRange() {
        LocalDate startDate = LocalDate.of(2026, 9, 1);
        LocalDate endDate = LocalDate.of(2026, 9, 30);
        QueryCalendarEvent query = new QueryCalendarEvent(20, 0, startDate, endDate, null);
        Business business = new Business();
        List<CalendarEvent> events = List.of(new CalendarEvent());
        when(businessRepository.findById("business-id")).thenReturn(Optional.of(business));
        when(calendarEventRepository.findByBusinessAndStartDateGreaterThanEqualAndEndDateLessThanEqual(
                business,
                startDate,
                endDate
        )).thenReturn(events);

        assertSame(events, calendarEventService.getAll(query, "business-id"));
    }
}
