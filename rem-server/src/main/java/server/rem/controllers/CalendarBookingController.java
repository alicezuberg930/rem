package server.rem.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import server.rem.dtos.APIResponse;
import server.rem.dtos.calendar_booking.CreateBookingRequest;
import server.rem.entities.CalendarBooking;
import server.rem.services.CalendarBookingService;
import server.rem.utils.messages.BookingMessages;

@Controller
@RequestMapping("/calendar-bookings")
@AllArgsConstructor
public class CalendarBookingController {
    private final CalendarBookingService calendarBookingService;

    @PostMapping
    public ResponseEntity<APIResponse<CalendarBooking>> create(@Valid @RequestBody CreateBookingRequest dto, @RequestAttribute("businessId") String businessId) {
        return ResponseEntity.ok().body(APIResponse.success(
                200,
                BookingMessages.CREATED,
                calendarBookingService.create(dto, businessId)
        ));
    }

    @GetMapping
    public ResponseEntity<APIResponse<List<CalendarBooking>>> getAll(@RequestAttribute("businessId") String businessId) {
        return ResponseEntity.ok().body(APIResponse.success(
                200,
                BookingMessages.LIST_RETRIEVED,
                calendarBookingService.getAll(businessId)
        ));
    }
}