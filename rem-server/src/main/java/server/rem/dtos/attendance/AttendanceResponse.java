package server.rem.dtos.attendance;

import lombok.*;
import server.rem.dtos.auth.UserProfileResponse;
import server.rem.enums.CheckInStatus;
import server.rem.enums.CheckInType;
import server.rem.views.Views;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonView;

@Getter
@AllArgsConstructor
public class AttendanceResponse {
    @JsonView(Views.Public.class)
    private final String id;

    @JsonView(Views.Public.class)
    private final Instant checkInTime;

    @JsonView(Views.Public.class)
    private final Instant checkOutTime;

    @JsonView(Views.Public.class)
    private final LocalDate date;

    @JsonView(Views.Public.class)
    private final CheckInType type;

    @JsonView(Views.Public.class)
    private final CheckInStatus status;

    @JsonView(Views.Public.class)
    private final String note;

    @JsonView(Views.Public.class)
    private final String address;

    @JsonView(Views.Public.class)
    private final BigDecimal latitude;
    
    @JsonView(Views.Public.class)
    private final BigDecimal longitude;

    @JsonView(Views.Public.class)
    private final UserProfileResponse user; 
}
