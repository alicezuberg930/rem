package server.rem.entities;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import server.rem.enums.CalendarBookingStatus;

@Entity
@Table(name = "calendar_bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CalendarBooking extends Base {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    @JsonIgnore
    private Business business;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_staff_id", nullable = true)
    @JsonIgnoreProperties({"businessesOwned", "businessUsers", "password"})
    private User serviceStaff;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "correspondent_id", nullable = true)
    @JsonIgnoreProperties({"businessesOwned", "businessUsers", "password"})
    private User correspondent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id", nullable = false)
    @JsonIgnoreProperties({"business", "tag", "campaigns"})
    private Contact contact;

    @Column(name = "booking_start_date", nullable = false)
    private Instant bookingStartDate;

    @Column(name = "booking_end_date", nullable = false)
    private Instant bookingEndDate;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private CalendarBookingStatus status = CalendarBookingStatus.BOOKED;

    @Column(name = "cancel_reason", length = 255, nullable = true)
    private String cancelReason;

    @Column(name = "not_attending_reason", length = 255, nullable = true)
    private String notAttendingReason;

    @Column(name = "complaint_reason", length = 255, nullable = true)
    private String complaintReason;
}