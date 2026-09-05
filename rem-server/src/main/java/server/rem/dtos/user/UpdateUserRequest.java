package server.rem.dtos.user;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class UpdateUserRequest {
    @NotBlank(message = "Fullname is required")
    @Size(max = 100)
    private final String fullname;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100)
    private final String email;

    @NotBlank(message = "Phone is required")
    @Size(max = 20)
    private final String phone;

    private final LocalDate birthday;

    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(regexp = ".*[a-z].*", message = "Password must contain a lowercase letter")
    @Pattern(regexp = ".*\\d.*", message = "Password must contain a number")
    private final String password;

    private final String confirmPassword;

    @NotBlank(message = "Role is required")
    private final String roleId;

    @NotNull(message = "Active status is required")
    private final Boolean isActive;

    @NotNull(message = "Verification status is required")
    private final Boolean isVerified;

    @NotNull(message = "Salary is required")
    @PositiveOrZero(message = "Salary must not be negative")
    private final Integer salary;

    @NotNull(message = "Dependants is required")
    @PositiveOrZero(message = "Dependants must not be negative")
    private final Integer dependants;

    @Size(max = 255)
    private final String bankOwner;

    @Size(max = 255)
    private final String bankAccount;

    @Size(max = 255)
    private final String bankName;

    @Size(max = 255)
    private final String bankCode;

    @Size(max = 255)
    private final String bankBranch;
}
