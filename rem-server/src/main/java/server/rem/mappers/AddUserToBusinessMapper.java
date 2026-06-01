package server.rem.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

import server.rem.dtos.business.AddUserToBusinessRequest;
import server.rem.entities.Business;
import server.rem.entities.BusinessUser;
import server.rem.entities.Role;
import server.rem.entities.User;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AddUserToBusinessMapper {
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

    // @Mapping(target = "id", ignore = true)
    // @Mapping(target = "business", ignore = true)
    // @Mapping(target = "user", ignore = true)
    // @Mapping(target = "contact", ignore = true)
    // @Mapping(target = "invitor", ignore = true)
    // @Mapping(target = "role", ignore = true)
    // @Mapping(target = "createdAt", ignore = true)
    // @Mapping(target = "updatedAt", ignore = true)
    // void updateBusinessUserEntity(AddUserToBusinessDto dto, @MappingTarget BusinessUser businessUser);

    // @Mapping(target = "id", ignore = true)
    // @Mapping(target = "provider", ignore = true)
    // @Mapping(target = "resetPasswordToken", ignore = true)
    // @Mapping(target = "resetPasswordTokenExpres", ignore = true)
    // @Mapping(target = "verifyTokenExpres", ignore = true)
    // @Mapping(target = "avatar", ignore = true)
    // @Mapping(target = "createdAt", ignore = true)
    // @Mapping(target = "updatedAt", ignore = true)
    // void updateUserEntity(AddUserToBusinessDto dto, @MappingTarget User user);
}
