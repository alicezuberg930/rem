package server.rem.mappers;

import org.mapstruct.*;

import server.rem.dtos.calendar_booking.CreateBookingRequest;
import server.rem.dtos.calendar_booking.UpdateBookingRequest;
import server.rem.entities.*;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface BookingMapper {
    @Mapping(target = "business", source = "business")
    @Mapping(target = "contact", source = "contact")
    @Mapping(target = "serviceStaff", source = "serviceStaff")
    @Mapping(target = "correspondent", source = "correspondent")
    @Mapping(target = "bookingStartDate", source = "dto.bookingStartDate")
    @Mapping(target = "bookingEndDate", source = "dto.bookingEndDate")
    @Mapping(target = "status", source = "dto.status")
    @Mapping(target = "cancelReason", ignore = true)
    @Mapping(target = "complaintReason", ignore = true)
    @Mapping(target = "notAttendingReason", ignore = true)
    CalendarBooking toEntity(CreateBookingRequest dto, Business business, User serviceStaff, User correspondent, Contact contact);

    @Mapping(target = "bookingStartDate", ignore = true)
    @Mapping(target = "bookingEndDate", ignore = true)
    @Mapping(target = "serviceStaff", source = "serviceStaff")
    @Mapping(target = "correspondent", source = "correspondent")
    @Mapping(target = "status", source = "dto.status")
    @Mapping(target = "cancelReason", source = "dto.cancelReason")
    @Mapping(target = "business", ignore = true)
    @Mapping(target = "contact", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "complaintReason", source = "dto.complaintReason")
    @Mapping(target = "notAttendingReason", source = "dto.notAttendingReason")
    void updateEntity(UpdateBookingRequest dto, User serviceStaff, User correspondent, @MappingTarget CalendarBooking entity);
}