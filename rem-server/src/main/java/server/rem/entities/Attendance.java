package server.rem.entities;

import jakarta.persistence.*;
import lombok.*;
import server.rem.enums.CheckInStatus;
import server.rem.enums.CheckInType;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "attendances")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attendance extends Base {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "check_in_time", nullable = false)
    private Instant checkInTime;

    @Column(name = "check_out_time")
    private Instant checkOutTime;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    @Builder.Default
    private CheckInType type = CheckInType.OFFICE;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private CheckInStatus status = CheckInStatus.ON_TIME;

    @Column(name = "note", length = 500)
    private String note;

    @Column(name = "address", length = 255, nullable = false)
    private String address;

    @Column(name = "latitude", precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 10, scale = 7)
    private BigDecimal longitude;
}