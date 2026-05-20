package server.rem.services;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import server.rem.dtos.calendar_event.*;
import server.rem.entities.*;
import server.rem.mappers.CalendarEventMapper;
import server.rem.repositories.*;
import server.rem.utils.exceptions.ResourceNotFoundException;
import server.rem.utils.messages.*;

@Service
@RequiredArgsConstructor
public class CalendarEventService {
    private final CalendarEventRepository calendarEventRepository;
    private final BusinessRepository businessRepository;
    private final UserRepository userRepository;

    public CalendarEvent createCalendarEvent(CreateCalendarEventRequest dto, String userId) {
        Business business = businessRepository.findById(dto.getBusinessId()).orElseThrow(() -> new ResourceNotFoundException("Business not found"));
        User user =  userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("Creator not found"));
        CalendarEvent calendarEvent = CalendarEventMapper.toEntity(dto);
        calendarEvent.setBusiness(business);
        calendarEvent.setCreatedBy(user);
        return calendarEvent;
    }

    public List<CalendarEvent> getAll(QueryCalendarEvent dto, String businessId) {
        Business business = businessRepository.findById(businessId).orElseThrow(() -> new ResourceNotFoundException(BusinessMessages.NOT_FOUND));
        List<CalendarEvent> calendarEvents = calendarEventRepository.findByBusinessAndStartDateGreaterThanEqualAndEndDateLessThanEqual(business, dto.getStartDate(), dto.getEndDate());
        return calendarEvents;
    } 
}
