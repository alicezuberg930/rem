package server.rem.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

import server.rem.dtos.auth.PermissionResponse;
import server.rem.dtos.auth.RoleResponse;
import server.rem.dtos.auth.SignInResponse;
import server.rem.dtos.auth.UserBusinessResponse;
import server.rem.dtos.auth.UserProfileResponse;
import server.rem.dtos.business.BusinessResponse;
import server.rem.entities.Business;
import server.rem.entities.BusinessUser;
import server.rem.entities.Permission;
import server.rem.entities.Role;
import server.rem.entities.User;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AuthMapper {
    PermissionResponse toPermissionResponse(Permission permission);

    // MapStruct automatically map permissions list to role using above method
    RoleResponse toRoleResponse(Role role);

    BusinessResponse toBusinessResponse(Business business);

    // BusinessUser → UserBusinessResponse (flattened)
    @Mapping(target = "business", source = "business") // unwrapped whole business object by Jackson
    @Mapping(target = "role", source = "role")
    @Mapping(target = "isActive", source = "isActive")
    @Mapping(target = "isVerified", source = "isVerified")
    @Mapping(target = "salary", source = "salary")
    @Mapping(target = "bankOwner", source = "bankOwner")
    @Mapping(target = "bankAccount", source = "bankAccount")
    @Mapping(target = "bankName", source = "bankName")
    @Mapping(target = "bankCode", source = "bankCode")
    @Mapping(target = "bankBranch", source = "bankBranch")
    @Mapping(target = "dependants", source = "dependants")
    UserBusinessResponse toUserBusinessResponse(BusinessUser businessUser);

    // User → UserProfileResponse
    // MapStruct auto-applies toUserBusinessResponse for each element in businessUsers list
    @Mapping(target = "businesses", source = "businessUsers")
    UserProfileResponse toSummaryResponse(User user);

    @Mapping(target = "accessToken", source = "accessToken")
    @Mapping(target = "refreshToken", source = "refreshToken")
    @Mapping(target = "user.businesses", ignore = true)
    SignInResponse toResponse(User user, String accessToken, String refreshToken);
}