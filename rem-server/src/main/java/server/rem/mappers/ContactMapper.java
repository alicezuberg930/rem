package server.rem.mappers;

import org.mapstruct.*;

import server.rem.dtos.contact.ContactResponse;
import server.rem.dtos.contact.CreateContactRequest;
import server.rem.entities.Business;
import server.rem.entities.Contact;
import server.rem.entities.ContactTag;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ContactMapper {

    @Mapping(target = "business", source = "business")
    @Mapping(target = "tag", source = "tag")
    @Mapping(target = "type", source = "dto.type")
    @Mapping(target = "firstName", source = "dto.firstName")
    @Mapping(target = "lastName", source = "dto.lastName")
    @Mapping(target = "surname", source = "dto.surname")
    @Mapping(target = "phone", source = "dto.phone")
    @Mapping(target = "mobilePhone", source = "dto.mobilePhone")
    @Mapping(target = "email", source = "dto.email")
    @Mapping(target = "birthday", source = "dto.birthday")
    @Mapping(target = "occupation", source = "dto.occupation")
    @Mapping(target = "taxCode", source = "dto.taxCode")
    @Mapping(target = "website", source = "dto.website")
    @Mapping(target = "facebook", source = "dto.facebook")
    @Mapping(target = "instagram", source = "dto.instagram")
    @Mapping(target = "zalo", source = "dto.zalo")
    @Mapping(target = "identityCard", source = "dto.identityCard")
    @Mapping(target = "identityIssuedOn", source = "dto.identityIssuedOn")
    @Mapping(target = "identityIssuedAt", source = "dto.identityIssuedAt")
    @Mapping(target = "insuranceNumber", source = "dto.insuranceNumber")
    @Mapping(target = "note", source = "dto.note")
    @Mapping(target = "address1", source = "dto.address1")
    @Mapping(target = "address2", source = "dto.address2")
    @Mapping(target = "country", source = "dto.country")
    @Mapping(target = "zipCode", source = "dto.zipCode")
    @Mapping(target = "campaigns", ignore = true)
    Contact toEntity(CreateContactRequest dto, Business business, ContactTag tag);

    @Mapping(target = "business", ignore = true)
    @Mapping(target = "tag", source = "tag")
    @Mapping(target = "type", source = "dto.type")
    @Mapping(target = "firstName", source = "dto.firstName")
    @Mapping(target = "lastName", source = "dto.lastName")
    @Mapping(target = "surname", source = "dto.surname")
    @Mapping(target = "phone", source = "dto.phone")
    @Mapping(target = "mobilePhone", source = "dto.mobilePhone")
    @Mapping(target = "email", source = "dto.email")
    @Mapping(target = "birthday", source = "dto.birthday")
    @Mapping(target = "occupation", source = "dto.occupation")
    @Mapping(target = "taxCode", source = "dto.taxCode")
    @Mapping(target = "website", source = "dto.website")
    @Mapping(target = "facebook", source = "dto.facebook")
    @Mapping(target = "instagram", source = "dto.instagram")
    @Mapping(target = "zalo", source = "dto.zalo")
    @Mapping(target = "identityCard", source = "dto.identityCard")
    @Mapping(target = "identityIssuedOn", source = "dto.identityIssuedOn")
    @Mapping(target = "identityIssuedAt", source = "dto.identityIssuedAt")
    @Mapping(target = "insuranceNumber", source = "dto.insuranceNumber")
    @Mapping(target = "note", source = "dto.note")
    @Mapping(target = "address1", source = "dto.address1")
    @Mapping(target = "address2", source = "dto.address2")
    @Mapping(target = "country", source = "dto.country")
    @Mapping(target = "zipCode", source = "dto.zipCode")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "campaigns", ignore = true)
    void updateEntity(CreateContactRequest dto, ContactTag tag, @MappingTarget Contact contact);

    ContactResponse toContactResponse(Contact contact);
}
