package server.rem.dtos.user;

import java.time.LocalDate;

import server.rem.enums.AuthProvider;

public record CreateUserResponse(
        String id,
        String fullname,
        String email,
        String phone,
        LocalDate birthday,
        AuthProvider provider,
        Boolean isVerified,
        String businessId,
        String roleId,
        String roleName,
        Boolean isActive,
        Boolean membershipVerified,
        Integer salary,
        Integer dependants,
        String bankOwner,
        String bankAccount,
        String bankName,
        String bankCode,
        String bankBranch) {
}
