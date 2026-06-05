package server.rem.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import server.rem.dtos.CustomPageResponse;
import server.rem.dtos.attendance.*;
import server.rem.entities.*;
import server.rem.enums.CheckInStatus;
import server.rem.mappers.AttendanceMapper;
import server.rem.repositories.*;
import server.rem.specifications.AttendanceSpecification;
import server.rem.utils.exceptions.*;
import server.rem.utils.messages.AttendanceMessages;
import server.rem.utils.messages.BusinessMessages;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Service
@RequiredArgsConstructor
public class AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;
    private final BusinessRepository businessRepository;
    private final AttendanceMapper attendanceMapper;

    public AttendanceResponse checkIn(String userId, CreateAttendanceRequest dto, String businessId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Business business = businessRepository.findById(businessId).orElseThrow(() -> new ResourceNotFoundException(BusinessMessages.NOT_FOUND));
        if (attendanceRepository.existsByBusinessAndUserAndDate(business, user, LocalDate.now())) {
            throw new ConflictException(AttendanceMessages.ALREADY_CHECKED_IN);
        }
        Attendance attendance = attendanceMapper.toEntity(dto, user, business);
        attendance.setStatus(resolveStatus(dto.getCheckInTime(), business.getWorkStartTime()));
        return attendanceMapper.toAttendanceResponse(attendanceRepository.save(attendance));
    }

    private CheckInStatus resolveStatus(Instant checkInTime, LocalTime workStartTime) {
        if (workStartTime == null) return CheckInStatus.ON_TIME;
        ZonedDateTime gmt7Time = checkInTime.atZone(ZoneId.of("Asia/Ho_Chi_Minh"));
        return gmt7Time.toLocalTime().isAfter(workStartTime) ? CheckInStatus.LATE : CheckInStatus.ON_TIME;
    }

    private CustomPageResponse<AttendanceResponse> getAttendanceList(QueryAttendance dto, String userId) {
        Pageable pageable = PageRequest.of(dto.getPage(), dto.getPageSize());
        Specification<Attendance> spec = AttendanceSpecification.withFilters(dto, userId);
        Page<AttendanceResponse> result = attendanceRepository.findAll(spec, pageable).map(attendanceMapper::toAttendanceResponse);
        return new CustomPageResponse<AttendanceResponse>(result);
    }

    // only members are authorized
    public CustomPageResponse<AttendanceResponse> getMe(QueryAttendance dto, String userId) {
        return getAttendanceList(dto, userId);
    }

    // HR & admin are authorized
    public CustomPageResponse<AttendanceResponse> getAll(QueryAttendance dto) {
        System.out.println(dto.toString());
        return getAttendanceList(dto, null);
    }
}