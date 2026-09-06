package server.rem.dtos.customer;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateCustomerRequest {
    @NotBlank(message = "Contact ID is required")
    private String contactId;

    private String customerGroupId;

    private LocalDate customerSince;
}
