package server.rem.entities;

import java.time.LocalDate;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;
import server.rem.enums.ContactType;

@Entity
@Table(name = "contacts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contact extends Base {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    @JsonIgnoreProperties("business")
    private Business business;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id", nullable = false)
    @JsonIgnoreProperties("tag")
    private ContactTag tag;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private ContactType type;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "surname", nullable = false)
    private String surname;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "mobile_phone", nullable = true)
    private String mobilePhone;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "birthday", nullable = true)
    private String birthday;

    @Column(name = "occupation", nullable = true)
    private String occupation;

    @Column(name = "tax_code", nullable = true)
    private String taxCode;

    @Column(name = "website", nullable = true)
    private String website;

    @Column(name = "facebook", nullable = true)
    private String facebook;

    @Column(name = "instagram", nullable = true)
    private String instagram;

    @Column(name = "zalo", nullable = true)
    private String zalo;

    @Column(name = "identity_card", nullable = true)
    private String identityCard;

    @Column(name = "identity_issued_on", nullable = true)
    private LocalDate identityIssuedOn;

    @Column(name = "identity_issued_at", nullable = true)
    private String identityIssuedAt;

    @Column(name = "insurance_number", nullable = true)
    private String insuranceNumber;

    @Column(name = "note", nullable = true)
    private String note;

    @Column(name = "address_1", nullable = true)
    private String address1;

    @Column(name = "address_2", nullable = true)
    private String address2;

    @Column(name = "country", nullable = true)
    private String country;

    @Column(name = "zip_code", nullable = true)
    private String zipCode;

    @ManyToMany(mappedBy = "contacts", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Campaign> campaigns;
}
