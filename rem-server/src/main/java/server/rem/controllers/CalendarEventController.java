package server.rem.controllers;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import server.rem.annotations.RequestUser;
import server.rem.dtos.APIResponse;
import server.rem.dtos.calendar_event.CreateCalendarEventRequest;
import server.rem.dtos.calendar_event.QueryCalendarEvent;
import server.rem.entities.CalendarEvent;
import server.rem.services.CalendarEventService;

@RestController
@RequestMapping("/calendar/events")
public class CalendarEventController {
    private final CalendarEventService calendarEventService;

    public CalendarEventController(CalendarEventService calendarEventService) {
        this.calendarEventService = calendarEventService;
    }

    @PostMapping
    public ResponseEntity<APIResponse<CalendarEvent>> createCalendarEvent(@RequestUser String userId, @Valid @RequestBody CreateCalendarEventRequest dto) {
        return ResponseEntity.ok().body(APIResponse.success(
            201,
            "Calendar event created successfully",
            calendarEventService.createCalendarEvent(dto, userId)
        ));
    }

    @GetMapping
    public ResponseEntity<APIResponse<List<CalendarEvent>>> getAll(@ModelAttribute QueryCalendarEvent dto, @RequestAttribute("businessId") String businessId) {
        return ResponseEntity.ok().body(APIResponse.success(
            200,
            "Calendar event list retrieved successfully",
            calendarEventService.getAll(dto, businessId)
        ));
    }
}
