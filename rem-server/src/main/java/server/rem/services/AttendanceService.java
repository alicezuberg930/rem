package server.rem.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import server.rem.dtos.attendance.*;
import server.rem.entities.*;
import server.rem.enums.CheckInStatus;
import server.rem.mappers.AttendanceMapper;
import server.rem.repositories.*;
import server.rem.specifications.AttendanceSpecification;
import server.rem.utils.exceptions.*;

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

    public Attendance checkIn(String userId, CreateAttendanceRequest dto, String businessId) {
        System.out.println(dto.toString());
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Business business = businessRepository.findById(businessId).orElseThrow(() -> new ResourceNotFoundException("Business not found"));
        if (attendanceRepository.existsByBusinessAndUserAndDate(business, user, LocalDate.now())){
            throw new ConflictException("User already checked in today");
        }
        Attendance attendance = AttendanceMapper.toEntity(dto);
        attendance.setUser(user);
        attendance.setBusiness(business);
        attendance.setStatus(resolveStatus(dto.getCheckInTime(), business.getWorkStartTime()));
        return attendanceRepository.save(attendance);
    }

//    public Attendance checkOut

    private CheckInStatus resolveStatus(Instant checkInTime, LocalTime workStartTime) {
        if (workStartTime == null) return CheckInStatus.ON_TIME;
        ZonedDateTime gmt7Time = checkInTime.atZone(ZoneId.of("Asia/Ho_Chi_Minh"));
        return gmt7Time.toLocalTime().isAfter(workStartTime) ? CheckInStatus.LATE : CheckInStatus.ON_TIME;
    }

    private Page<Attendance> getAttendanceList(QueryAttendance dto, String userId) {
        Pageable pageable = PageRequest.of(dto.getPage(), dto.getPageSize());
        Specification<Attendance> spec = AttendanceSpecification.withFilters(dto, userId);
        return attendanceRepository.findAll(spec, pageable);
    }

    // only members are authorized
    public Page<Attendance> getMyAttendances(QueryAttendance dto, String userId) {
        return getAttendanceList(dto, userId);
    }

    // only HR, admin are authorized
    public Page<Attendance> getAllAttendances(QueryAttendance dto) {
        System.out.println(dto.toString());
        return getAttendanceList(dto, null);
    }
}