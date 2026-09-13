package server.rem.dtos.auth;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import server.rem.enums.AuthProvider;

@Getter
@AllArgsConstructor
public class SignUpRequest {
    @NotBlank(message = "Fullname is required")
    @Size(max = 100)
    private final String fullname;

    @Size(max = 10)
    private final String phone;

    // Optional
    @Size(max = 255)
    private final String avatar;

    // Optional (default can be handled in service)
    private final AuthProvider provider;

    // Optional
    private final LocalDate birthday;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100)
    private final String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private final String password;
}
