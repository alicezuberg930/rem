package server.rem.dtos.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import server.rem.enums.ContactType;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class CreateContactRequest {
    @NotNull(message = "Business ID is required")
    private final String businessId;

    @NotNull(message = "Tag ID is required")
    private final String tagId;

    @NotNull(message = "Contact type is required")
    private final ContactType type;

    @NotBlank(message = "First name is required")
    private final String firstName;

    @NotBlank(message = "Last name is required")
    private final String lastName;

    @NotBlank(message = "Surname is required")
    private final String surname;

    @NotBlank(message = "Phone is required")
    private final String phone;

    private final String mobilePhone;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private final String email;

    private final String birthday;

    private final String occupation;

    @NotBlank(message = "Tax code is required")
    private final String taxCode;

    private final String website;
    private final String facebook;
    private final String instagram;
    private final String zalo;
    private final String identityCard;
    private final LocalDate identityIssuedOn;
    private final String identityIssuedAt;
    private final String insuranceNumber;
    private final String note;
    private final String address1;
    private final String address2;
    private final String country;
    private final String zipCode;
}
