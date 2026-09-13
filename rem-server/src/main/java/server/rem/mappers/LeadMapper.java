package server.rem.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

import server.rem.dtos.lead.CreateLeadRequest;
import server.rem.entities.Contact;
import server.rem.entities.Lead;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface LeadMapper {
    @Mapping(target = "contact", source = "contact")
    @Mapping(target = "source", source = "dto.source")
    @Mapping(target = "status", source = "dto.status")
    Lead toEntity(CreateLeadRequest dto, Contact contact);
}
