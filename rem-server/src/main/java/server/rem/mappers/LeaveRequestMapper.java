package server.rem.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

import server.rem.dtos.leave_request.CreateLeaveRequest;
import server.rem.entities.Business;
import server.rem.entities.LeaveRequest;
import server.rem.entities.User;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface LeaveRequestMapper {
    @Mapping(target = "business", source = "business")
    @Mapping(target = "user", source = "user")
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "approver", ignore = true)
    @Mapping(target = "approverNote", ignore = true)
    LeaveRequest toEntity(CreateLeaveRequest dto, Business business, User user);
}
