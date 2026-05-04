package server.rem.controllers;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import server.rem.annotations.RequestUser;
import server.rem.dtos.APIResponse;
import server.rem.dtos.leave_request.CreateLeaveRequest;
import server.rem.dtos.leave_request.QueryLeaveRequest;
import server.rem.dtos.leave_request.UpdateLeaveRequest;
import server.rem.entities.LeaveRequest;
import server.rem.services.LeaveRequestService;

@RestController
@RequestMapping("/leaves")
public class LeaveRequestController {
    private final LeaveRequestService leaveRequestService;

    public LeaveRequestController(LeaveRequestService leaveRequestService) {
        this.leaveRequestService = leaveRequestService;
    }

    @PostMapping
    public ResponseEntity<APIResponse<LeaveRequest>> createLeaveRequest(@RequestUser String userId, @Valid @RequestBody CreateLeaveRequest dto) {
        return ResponseEntity.ok().body(APIResponse.success(
            201,
            "Leave request created successfully",
            leaveRequestService.createLeaveRequest(userId, dto)
        ));
    }

    @GetMapping
    public ResponseEntity<APIResponse<Page<LeaveRequest>>> getAll(
        @ModelAttribute QueryLeaveRequest dto, 
        @RequestAttribute("businessId") String businessId
    ) {
        return ResponseEntity.ok().body(APIResponse.success(
            200,
            "Leave request list retrieved successfully",
            leaveRequestService.getAll(dto, businessId)
        ));
    }

    @PutMapping("/{leaveId}")
    public ResponseEntity<APIResponse<LeaveRequest>> updateLeaveRequest(@PathVariable String leaveId, @Valid @RequestBody UpdateLeaveRequest dto, @RequestUser String userId) {
        return ResponseEntity.ok().body(APIResponse.success(
            200,
            "Leave request updated successfully",
            leaveRequestService.updateLeaveRequest(leaveId, dto, userId)
        ));
    }

    @PutMapping("/status/{leaveId}")
    public ResponseEntity<APIResponse<LeaveRequest>> updateLeaveRequestStatus(@PathVariable String leaveId, @Valid @RequestBody UpdateLeaveRequest dto, @RequestUser String userId) {
        return ResponseEntity.ok().body(APIResponse.success(
            200,
            "Leave request status updated successfully",
            leaveRequestService.updateLeaveRequestStatus(leaveId, dto, userId)
        ));
    }

}
