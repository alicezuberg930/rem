package server.rem.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;

import server.rem.dtos.auth.SignUpRequest;
import server.rem.dtos.user.CreateUserRequest;
import server.rem.dtos.user.CreateUserResponse;
import server.rem.dtos.user.UpdateUserRequest;
import server.rem.dtos.user.UserListResponse;
import server.rem.dtos.user.UserRoleResponse;
import server.rem.entities.Business;
import server.rem.entities.BusinessUser;
import server.rem.entities.Role;
import server.rem.entities.User;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {
    @Mapping(target = "fullname", source = "fullname", qualifiedByName = "trim")
    @Mapping(target = "phone", source = "phone", qualifiedByName = "trim")
    @Mapping(target = "email", source = "email", qualifiedByName = "trim")
    @Mapping(target = "provider", expression = "java(dto.getProvider() == null ? AuthProvider.LOCAL : dto.getProvider())")
    @Mapping(target = "isVerified", ignore = true)
    @Mapping(target = "verifyToken", ignore = true)
    @Mapping(target = "verifyTokenExpires", ignore = true)
    @Mapping(target = "resetPasswordToken", ignore = true)
    @Mapping(target = "resetPasswordExpires", ignore = true)
    @Mapping(target = "businessesOwned", ignore = true)
    @Mapping(target = "businessUsers", ignore = true)
    User toEntity(SignUpRequest dto);

    @Mapping(target = "fullname", source = "request.fullname", qualifiedByName = "trim")
    @Mapping(target = "email", source = "request.email", qualifiedByName = "trim")
    @Mapping(target = "phone", source = "request.phone", qualifiedByName = "trim")
    @Mapping(target = "password", source = "encodedPassword")
    @Mapping(target = "provider", constant = "LOCAL")
    @Mapping(target = "avatar", ignore = true)
    @Mapping(target = "verifyToken", ignore = true)
    @Mapping(target = "verifyTokenExpires", ignore = true)
    @Mapping(target = "resetPasswordToken", ignore = true)
    @Mapping(target = "resetPasswordExpires", ignore = true)
    @Mapping(target = "businessesOwned", ignore = true)
    @Mapping(target = "businessUsers", ignore = true)
    User toEntity(CreateUserRequest request, String encodedPassword);

    @Mapping(target = "fullname", source = "fullname", qualifiedByName = "trim")
    @Mapping(target = "email", source = "email", qualifiedByName = "trim")
    @Mapping(target = "phone", source = "phone", qualifiedByName = "trim")
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "avatar", ignore = true)
    @Mapping(target = "provider", ignore = true)
    @Mapping(target = "verifyToken", ignore = true)
    @Mapping(target = "verifyTokenExpires", ignore = true)
    @Mapping(target = "resetPasswordToken", ignore = true)
    @Mapping(target = "resetPasswordExpires", ignore = true)
    @Mapping(target = "businessesOwned", ignore = true)
    @Mapping(target = "businessUsers", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(UpdateUserRequest request, @MappingTarget User user);

    @Mapping(target = "id", expression = "java(new server.rem.entities.BusinessUserId(business.getId(), user.getId()))")
    @Mapping(target = "business", source = "business")
    @Mapping(target = "user", source = "user")
    @Mapping(target = "invitor", source = "invitor")
    @Mapping(target = "role", source = "role")
    @Mapping(target = "isActive", source = "request.isActive")
    @Mapping(target = "isVerified", source = "request.isVerified")
    @Mapping(target = "salary", source = "request.salary")
    @Mapping(target = "dependants", source = "request.dependants")
    @Mapping(target = "bankOwner", source = "request.bankOwner", qualifiedByName = "blankToNull")
    @Mapping(target = "bankAccount", source = "request.bankAccount", qualifiedByName = "blankToNull")
    @Mapping(target = "bankName", source = "request.bankName", qualifiedByName = "blankToNull")
    @Mapping(target = "bankCode", source = "request.bankCode", qualifiedByName = "blankToNull")
    @Mapping(target = "bankBranch", source = "request.bankBranch", qualifiedByName = "blankToNull")
    BusinessUser toMembership(CreateUserRequest request, Business business, User user, User invitor, Role role);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "business", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "invitor", ignore = true)
    @Mapping(target = "role", source = "role")
    @Mapping(target = "isActive", source = "request.isActive")
    @Mapping(target = "isVerified", source = "request.isVerified")
    @Mapping(target = "salary", source = "request.salary")
    @Mapping(target = "dependants", source = "request.dependants")
    @Mapping(target = "bankOwner", source = "request.bankOwner", qualifiedByName = "blankToNull")
    @Mapping(target = "bankAccount", source = "request.bankAccount", qualifiedByName = "blankToNull")
    @Mapping(target = "bankName", source = "request.bankName", qualifiedByName = "blankToNull")
    @Mapping(target = "bankCode", source = "request.bankCode", qualifiedByName = "blankToNull")
    @Mapping(target = "bankBranch", source = "request.bankBranch", qualifiedByName = "blankToNull")
    void updateMembership(UpdateUserRequest request, Role role, @MappingTarget BusinessUser membership);

    @Mapping(target = "id", source = "user.id")
    @Mapping(target = "fullname", source = "user.fullname")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "phone", source = "user.phone")
    @Mapping(target = "birthday", source = "user.birthday")
    @Mapping(target = "provider", source = "user.provider")
    @Mapping(target = "isVerified", source = "user.isVerified")
    @Mapping(target = "businessId", source = "membership.business.id")
    @Mapping(target = "roleId", source = "membership.role.id")
    @Mapping(target = "roleName", source = "membership.role.name")
    @Mapping(target = "isActive", source = "membership.isActive")
    @Mapping(target = "membershipVerified", source = "membership.isVerified")
    @Mapping(target = "salary", source = "membership.salary")
    @Mapping(target = "dependants", source = "membership.dependants")
    @Mapping(target = "bankOwner", source = "membership.bankOwner")
    @Mapping(target = "bankAccount", source = "membership.bankAccount")
    @Mapping(target = "bankName", source = "membership.bankName")
    @Mapping(target = "bankCode", source = "membership.bankCode")
    @Mapping(target = "bankBranch", source = "membership.bankBranch")
    CreateUserResponse toCreateUserResponse(User user, BusinessUser membership);

    @Mapping(target = "id", source = "user.id")
    @Mapping(target = "fullname", source = "user.fullname")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "phone", source = "user.phone")
    @Mapping(target = "birthday", source = "user.birthday")
    @Mapping(target = "provider", source = "user.provider")
    @Mapping(target = "isVerified", source = "user.isVerified")
    @Mapping(target = "businessId", source = "business.id")
    @Mapping(target = "roleId", source = "role.id")
    @Mapping(target = "roleName", source = "role.name")
    @Mapping(target = "isActive", source = "isActive")
    @Mapping(target = "membershipVerified", source = "isVerified")
    UserListResponse toListResponse(BusinessUser membership);

    UserRoleResponse toRoleResponse(Role role);

    @Named("trim")
    default String trim(String value) {
        return value == null ? null : value.trim();
    }

    @Named("blankToNull")
    default String blankToNull(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
