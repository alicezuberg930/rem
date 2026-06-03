package server.rem.dtos.attendance;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import server.rem.enums.CheckInType;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Getter
@AllArgsConstructor
@ToString
public class CreateAttendanceRequest {
    @NotNull(message = "Check in time must not be null")
    private final Instant checkInTime;

    private final Instant checkOutTime;

    @NotNull(message = "Date must not be null")
    private final LocalDate date;

    private final CheckInType type;

    private final String note;

    @NotEmpty(message = "Address cannot be empty")
    @NotNull(message = "Address must not be null")
    @NotBlank(message = "Address must not be blank")
    private final String address;

    @DecimalMin(value = "-90.0", message = "Latitude must be >= -90")
    @DecimalMax(value = "90.0", message = "Latitude must be <= 90")
    @NotNull(message = "Latitude must not be null")
    private final BigDecimal latitude;

    @DecimalMin(value = "-180.0", message = "Longitude must be >= -180")
    @DecimalMax(value = "180.0", message = "Longitude must be <= 180")
    @NotNull(message = "Longitude must not be null")
    private final BigDecimal longitude;
}