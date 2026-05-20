package server.rem.services;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import server.rem.dtos.calendar_booking.CreateBookingRequest;
import server.rem.dtos.calendar_booking.UpdateBookingRequest;
import server.rem.entities.*;
import server.rem.mappers.BookingMapper;
import server.rem.repositories.*;
import server.rem.utils.exceptions.ResourceNotFoundException;
import server.rem.utils.messages.*;

@Service
@AllArgsConstructor
public class CalendarBookingService {
    private final UserRepository userRepository;
    private final BusinessRepository businessRepository;
    private final CalendarBookingRepository calendarBookingRepository;
    private final BookingMapper bookingMapper;
    private final ContactRepository contactRepository;

    public List<CalendarBooking> getAll(String businessId) {
        return calendarBookingRepository.findAll();
    }

    public CalendarBooking find(String id) {
        return calendarBookingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(""));
    }

    public CalendarBooking create(CreateBookingRequest dto, String businessId) {
        Business business = businessRepository.findById(businessId).orElseThrow(() -> new ResourceNotFoundException(BusinessMessages.NOT_FOUND));
        User serviceStaff = dto.getServiceStaffId() != null ? userRepository.findById(dto.getServiceStaffId()).orElse(null) : null;
        User correspondent = dto.getCorrespondentId() != null ? userRepository.findById(dto.getCorrespondentId()).orElse(null) : null;
        Contact contact = contactRepository.findById(dto.getContactId()).orElseThrow(() -> new ResourceNotFoundException(ContactMessages.NOT_FOUND));
        CalendarBooking calendarBooking = bookingMapper.toEntity(dto, business, serviceStaff, correspondent, contact);
        return calendarBookingRepository.save(calendarBooking);
    }

    public CalendarBooking update(UpdateBookingRequest dto, String id) {
        CalendarBooking calendarBooking = calendarBookingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(BookingMessages.NOT_FOUND));
        User serviceStaff = dto.getServiceStaffId() != null ? userRepository.findById(dto.getServiceStaffId()).orElse(null) : null;
        User correspondent = dto.getCorrespondentId() != null ? userRepository.findById(dto.getCorrespondentId()).orElse(null) : null;
        bookingMapper.updateEntity(dto, serviceStaff, correspondent, calendarBooking);
        return calendarBookingRepository.save(calendarBooking);
    }
}