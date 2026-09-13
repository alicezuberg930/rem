package server.rem.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import server.rem.dtos.business.AddUserToBusinessRequest;
import server.rem.dtos.business.BusinessResponse;
import server.rem.dtos.business.CreateBusinessRequest;
import server.rem.dtos.business.UpdateBusinessRequest;
import server.rem.entities.Business;
import server.rem.entities.BusinessUser;
import server.rem.entities.Role;
import server.rem.entities.User;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface BusinessMapper {

    @Mapping(target = "owner", source = "owner")
    Business toEntity(CreateBusinessRequest dto, User owner);

    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "businessUsers", ignore = true)
    void updateEntity(UpdateBusinessRequest dto, @MappingTarget Business entity);

    List<BusinessResponse> toBusinessesResponse(List<Business> businesses);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "business", source = "business")
    @Mapping(target = "role", source = "role")
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "invitor", ignore = true)
    BusinessUser toBusinessUserEntity(AddUserToBusinessRequest dto, Business business, Role role);

    @Mapping(target = "provider", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "resetPasswordToken", ignore = true)
    @Mapping(target = "resetPasswordExpires", ignore = true)
    @Mapping(target = "verifyToken", ignore = true)
    @Mapping(target = "verifyTokenExpires", ignore = true)
    @Mapping(target = "avatar", ignore = true)
    @Mapping(target = "businessesOwned", ignore = true)
    @Mapping(target = "businessUsers", ignore = true)
    User toUserEntity(AddUserToBusinessRequest dto);

}
