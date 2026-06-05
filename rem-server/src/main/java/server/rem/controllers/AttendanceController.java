package server.rem.controllers;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import server.rem.annotations.RequestUser;
import server.rem.dtos.APIResponse;
import server.rem.dtos.CustomPageResponse;
import server.rem.dtos.attendance.AttendanceResponse;
import server.rem.dtos.attendance.CreateAttendanceRequest;
import server.rem.dtos.attendance.QueryAttendance;
import server.rem.services.AttendanceService;

@RestController
@RequestMapping("/attendances")
public class AttendanceController {
    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/check-in")
    public ResponseEntity<APIResponse<AttendanceResponse>> checkIn(@RequestUser String userId, @Valid @RequestBody CreateAttendanceRequest dto, @RequestAttribute("businessId") String businessId) {
        return ResponseEntity.ok().body(APIResponse.success(
            201,
            "Check in successfully",
            attendanceService.checkIn(userId, dto, businessId)
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<APIResponse<CustomPageResponse<AttendanceResponse>>> getMe(@ModelAttribute QueryAttendance dto, @RequestUser String userId) {
        return ResponseEntity.ok().body(APIResponse.success(
            200,
            "Attendance list retrieved successfully",
            attendanceService.getMe(dto, userId)
        ));
    }

    @GetMapping("/all")
    public ResponseEntity<APIResponse<CustomPageResponse<AttendanceResponse>>> getAll(@ModelAttribute QueryAttendance dto) {
        return ResponseEntity.ok().body(APIResponse.success(
            200,
            "Attendance list retrieved successfully",
            attendanceService.getAll(dto)
        ));
    }
}
