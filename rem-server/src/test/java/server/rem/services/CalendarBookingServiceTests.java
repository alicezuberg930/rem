package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import server.rem.entities.CalendarBooking;
import server.rem.mappers.BookingMapper;
import server.rem.repositories.BusinessRepository;
import server.rem.repositories.CalendarBookingRepository;
import server.rem.repositories.ContactRepository;
import server.rem.repositories.UserRepository;

@ExtendWith(MockitoExtension.class)
class CalendarBookingServiceTests {
    @Mock
    private UserRepository userRepository;
    @Mock
    private BusinessRepository businessRepository;
    @Mock
    private CalendarBookingRepository calendarBookingRepository;
    @Mock
    private BookingMapper bookingMapper;
    @Mock
    private ContactRepository contactRepository;

    private CalendarBookingService calendarBookingService;

    @BeforeEach
    void setUp() {
        calendarBookingService = new CalendarBookingService(
                userRepository,
                businessRepository,
                calendarBookingRepository,
                bookingMapper,
                contactRepository
        );
    }

    @Test
    void findsBookingById() {
        CalendarBooking booking = new CalendarBooking();
        when(calendarBookingRepository.findById("booking-id")).thenReturn(Optional.of(booking));

        assertSame(booking, calendarBookingService.find("booking-id"));
    }
}
