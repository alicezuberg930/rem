package server.rem.dtos.business;

import jakarta.validation.constraints.*;
import lombok.*;
import server.rem.enums.MailProvider;
import server.rem.enums.PhoneProvider;

import java.time.LocalTime;

@Getter
@AllArgsConstructor
public class CreateBusinessRequest {
    @NotBlank(message = "Name is required")
    @NotEmpty(message = "Name cannot be empty")
    @NotNull(message = "Name cannot be null")
    @Size(max = 100)
    private final String name;

    @Size(max = 255)
    private final String description;

    @Size(max = 100)
    private final String slug;

    @Size(max = 255)
    private final String logoUrl;

    private final LocalTime workStartTime;

    private final Integer insuranceContributionSalary;

    @Size(max = 255)
    private final String twilioAccountSid;

    @Size(max = 255)
    private final String twilioAuthToken;

    @Size(max = 255)
    private final String twilioPhoneNumber;

    @Size(max = 255)
    private final String vonageApiKey;

    @Size(max = 255)
    private final String vonageApiSecret;

    @Size(max = 255)
    private final String cloudinaryCloudName;

    @Size(max = 255)
    private final String cloudinaryApiKey;

    @Size(max = 255)
    private final String cloudinaryApiSecret;

    @Size(max = 255)
    private final String resendApiKey;

    @Size(max = 255)
    private final String resendEmail;

    @Size(max = 255)
    private final String mailHost;

    private final Integer mailPort;

    @Size(max = 255)
    private final String mailUsername;

    @Size(max = 255)
    private final String mailPassword;

    private final MailProvider mailProvider;

    private final PhoneProvider phoneProvider;

    @Size(max = 255)
    private final String sendGridApiKey;

    @Size(max = 255)
    private final String sendGridUsername;

    @Size(max = 255)
    private final String mailgunApiKey;

    @Size(max = 255)
    private final String mailgunDomain;

    @Size(max = 255)
    private final String mailgunUsername;
}