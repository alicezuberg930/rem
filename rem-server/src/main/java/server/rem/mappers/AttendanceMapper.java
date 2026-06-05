package server.rem.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

import server.rem.dtos.attendance.AttendanceResponse;
import server.rem.dtos.attendance.CreateAttendanceRequest;
import server.rem.dtos.auth.UserProfileResponse;
import server.rem.entities.Attendance;
import server.rem.entities.Business;
import server.rem.entities.User;
// import server.rem.enums.CheckInType;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AttendanceMapper {
    @Mapping(target = "business", source = "business")
    @Mapping(target = "user", source = "user")
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "type", expression = "java(dto.getType() != null ? dto.getType() : CheckInType.OFFICE)")
    Attendance toEntity(CreateAttendanceRequest dto, User user, Business business);

    @Mapping(target = "businesses", ignore = true)
    UserProfileResponse toSummaryResponse(User user);

    AttendanceResponse toAttendanceResponse(Attendance attendance);
}