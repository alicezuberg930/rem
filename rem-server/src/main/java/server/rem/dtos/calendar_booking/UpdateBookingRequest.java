package server.rem.dtos.calendar_booking;

import lombok.*;
import server.rem.enums.CalendarBookingStatus;

@Getter
@AllArgsConstructor
public class UpdateBookingRequest {
    private final CalendarBookingStatus status;

    private final String cancelReason;

    private final String serviceStaffId;

    private final String correspondentId;

    private final String complaintReason;

    private final String notAttendingReason;
}
