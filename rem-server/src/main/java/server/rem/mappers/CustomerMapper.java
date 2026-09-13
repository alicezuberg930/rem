package server.rem.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

import server.rem.dtos.customer.CreateCustomerRequest;
import server.rem.entities.Contact;
import server.rem.entities.Customer;
import server.rem.entities.CustomerGroup;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CustomerMapper {
    @Mapping(target = "contact", source = "contact")
    @Mapping(target = "customerGroup", source = "customerGroup")
    @Mapping(target = "customerSince", source = "dto.customerSince", defaultExpression = "java(java.time.LocalDate.now())")
    Customer toEntity(CreateCustomerRequest dto, Contact contact, CustomerGroup customerGroup);
}
