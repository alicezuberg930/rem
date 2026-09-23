package server.rem.mappers;

import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import server.rem.dtos.variant.CreateVariantRequest;
import server.rem.dtos.variant.VariantResponse;
import server.rem.entities.Business;
import server.rem.entities.Variant;
import server.rem.entities.VariantOption;

@Mapper(
    componentModel = "spring",
    builder = @Builder(disableBuilder = true),
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface VariantMapper {
    @Mapping(target = "business", source = "business")
    @Mapping(target = "name", source = "dto.name")
    @Mapping(target = "options", ignore = true)
    @Mapping(target = "products", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Variant toEntity(CreateVariantRequest dto, Business business);

    @Mapping(target = "name", source = "dto.name")
    @Mapping(target = "business", ignore = true)
    @Mapping(target = "options", ignore = true)
    @Mapping(target = "products", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(CreateVariantRequest dto, @MappingTarget Variant variant);

    @Mapping(target = "name", source = "dto.value")
    @Mapping(target = "value", source = "dto.value")
    @Mapping(target = "variant", source = "variant")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    VariantOption toOption(CreateVariantRequest.VariantOptionRequest dto, Variant variant);

    VariantResponse toResponse(Variant variant);

    VariantResponse.VariantOptionResponse toOptionResponse(VariantOption option);
}
