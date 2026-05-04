package server.rem.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import server.rem.dtos.template.CreateTemplateRequest;
import server.rem.dtos.template.TemplateResponse;
import server.rem.dtos.template.UpdateTemplateRequest;
import server.rem.entities.Business;
import server.rem.entities.Template;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface TemplateMapper {
    @Mapping(target = "name", source = "dto.name")
    @Mapping(target = "header", source = "dto.header")
    @Mapping(target = "body", source = "dto.body")
    @Mapping(target = "footer", source = "dto.footer")
    @Mapping(target = "contactPhone", source = "dto.contactPhone")
    @Mapping(target = "websiteUrl", source = "dto.websiteUrl")
    @Mapping(target = "business", source = "business")
    Template toEntity(CreateTemplateRequest dto, Business business);

    @Mapping(target = "name", source = "dto.name")
    @Mapping(target = "header", source = "dto.header")
    @Mapping(target = "body", source = "dto.body")
    @Mapping(target = "footer", source = "dto.footer")
    @Mapping(target = "contactPhone", source = "dto.contactPhone")
    @Mapping(target = "websiteUrl", source = "dto.websiteUrl")
    @Mapping(target = "business", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(UpdateTemplateRequest dto, @MappingTarget Template template);

    TemplateResponse toTemplateResponse(Template template);
}
