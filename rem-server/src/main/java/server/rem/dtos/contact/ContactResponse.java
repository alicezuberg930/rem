package server.rem.dtos.contact;

import com.fasterxml.jackson.annotation.JsonView;

import lombok.*;
import server.rem.views.Views;

@Getter
@AllArgsConstructor
public class ContactResponse {
    @JsonView(Views.Public.class)
    private final String id;

    @JsonView(Views.Public.class)
    private final String type;

    @JsonView(Views.Public.class)
    private final String firstName;

    @JsonView(Views.Public.class)
    private final String lastName;

    @JsonView(Views.Public.class)
    private final String surname;

    @JsonView(Views.Public.class)
    private final String phone;

    @JsonView(Views.Public.class)
    private final String mobilePhone;

    @JsonView(Views.Public.class)
    private final String email;

    @JsonView(Views.Public.class)
    private final String birthday;

    @JsonView(Views.Public.class)
    private final String occupation;

    @JsonView(Views.Public.class)
    private final String taxCode;

    @JsonView(Views.Public.class)
    private final String website;

    @JsonView(Views.Public.class)
    private final String facebook;

    @JsonView(Views.Public.class)
    private final String instagram;

    @JsonView(Views.Public.class)
    private final String zalo;

    @JsonView(Views.Public.class)
    private final String identityCard;

    @JsonView(Views.Public.class)
    private final String identityIssuedOn;

    @JsonView(Views.Public.class)
    private final String identityIssuedAt;

    @JsonView(Views.Public.class)
    private final String insuranceNumber;

    @JsonView(Views.Public.class)
    private final String note;

    @JsonView(Views.Public.class)
    private final String address1;

    @JsonView(Views.Public.class)
    private final String address2;

    @JsonView(Views.Public.class)
    private final String country;

    @JsonView(Views.Public.class)
    private final String zipCode;

    @JsonView(Views.Public.class)
    private final ContactTagResponse tag;
}
