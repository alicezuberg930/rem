package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import server.rem.dtos.attendance.AttendanceResponse;
import server.rem.dtos.attendance.CreateAttendanceRequest;
import server.rem.entities.Attendance;
import server.rem.entities.Business;
import server.rem.entities.User;
import server.rem.enums.CheckInStatus;
import server.rem.enums.CheckInType;
import server.rem.mappers.AttendanceMapper;
import server.rem.repositories.AttendanceRepository;
import server.rem.repositories.BusinessRepository;
import server.rem.repositories.UserRepository;

@ExtendWith(MockitoExtension.class)
class AttendanceServiceTests {
    @Mock
    private AttendanceRepository attendanceRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private BusinessRepository businessRepository;
    @Mock
    private AttendanceMapper attendanceMapper;

    private AttendanceService attendanceService;

    @BeforeEach
    void setUp() {
        attendanceService = new AttendanceService(
                attendanceRepository,
                userRepository,
                businessRepository,
                attendanceMapper
        );
    }

    @Test
    void checksInLateUserAndPersistsAttendance() {
        User user = new User();
        Business business = Business.builder().workStartTime(LocalTime.of(9, 0)).build();
        Instant checkInTime = Instant.parse("2026-09-02T03:00:00Z");
        CreateAttendanceRequest request = new CreateAttendanceRequest(
                checkInTime,
                null,
                LocalDate.of(2026, 9, 2),
                CheckInType.OFFICE,
                null,
                "Office",
                BigDecimal.ZERO,
                BigDecimal.ZERO
        );
        Attendance attendance = Attendance.builder().build();
        AttendanceResponse response = org.mockito.Mockito.mock(AttendanceResponse.class);

        when(userRepository.findById("user-id")).thenReturn(java.util.Optional.of(user));
        when(businessRepository.findById("business-id")).thenReturn(java.util.Optional.of(business));
        when(attendanceRepository.existsByBusinessAndUserAndDate(eq(business), eq(user), any(LocalDate.class)))
                .thenReturn(false);
        when(attendanceMapper.toEntity(request, user, business)).thenReturn(attendance);
        when(attendanceRepository.save(attendance)).thenReturn(attendance);
        when(attendanceMapper.toAttendanceResponse(attendance)).thenReturn(response);

        assertSame(response, attendanceService.checkIn("user-id", request, "business-id"));
        assertEquals(CheckInStatus.LATE, attendance.getStatus());
    }
}
