package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import server.rem.dtos.calendar_event.CreateCalendarEventRequest;
import server.rem.dtos.calendar_event.QueryCalendarEvent;
import server.rem.entities.Business;
import server.rem.entities.CalendarEvent;
import server.rem.entities.User;
import server.rem.enums.CalendarEventType;
import server.rem.mappers.CalendarEventMapper;
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
        calendarEventService = new CalendarEventService(
                calendarEventRepository, businessRepository, userRepository, Mappers.getMapper(CalendarEventMapper.class));
    }

    @Test
    void createsEventWithResolvedBusinessAndCreator() {
        Business business = Business.builder().description("Business description").build();
        business.setId("business-id");
        User creator = new User();
        creator.setId("user-id");
        CreateCalendarEventRequest request = new CreateCalendarEventRequest(
                "business-id", "Team meeting", "Event description",
                LocalDate.of(2026, 9, 10), LocalDate.of(2026, 9, 10),
                LocalTime.of(9, 0), LocalTime.of(10, 0), CalendarEventType.MEETING);
        when(businessRepository.findById("business-id")).thenReturn(Optional.of(business));
        when(userRepository.findById("user-id")).thenReturn(Optional.of(creator));

        CalendarEvent event = calendarEventService.createCalendarEvent(request, "user-id");

        assertSame(business, event.getBusiness());
        assertSame(creator, event.getCreatedBy());
        assertEquals(request.getTitle(), event.getTitle());
        assertEquals(request.getDescription(), event.getDescription());
        assertEquals(request.getStartDate(), event.getStartDate());
        assertEquals(request.getEndDate(), event.getEndDate());
        assertEquals(request.getStartTime(), event.getStartTime());
        assertEquals(request.getEndTime(), event.getEndTime());
        assertEquals(request.getType(), event.getType());
        assertNull(event.getId());
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
