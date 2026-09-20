package server.rem.mappers;

import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import server.rem.dtos.product.CreateProductRequest;
import server.rem.entities.Business;
import server.rem.entities.Product;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true), nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ProductMapper {
    @Mapping(target = "business", source = "business")
    @Mapping(target = "name", source = "dto.name")
    @Mapping(target = "sku", source = "dto.sku")
    @Mapping(target = "unit", source = "dto.unit")
    @Mapping(target = "barCodeType", source = "dto.barCodeType")
    @Mapping(target = "expiredDate", source = "dto.expiredDate")
    @Mapping(target = "description", source = "dto.description")
    @Mapping(target = "previewImageUrl", source = "dto.previewImageUrl")
    @Mapping(target = "price", source = "dto.price")
    @Mapping(target = "variantMode", source = "dto.variantMode")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "variants", ignore = true)
    Product toEntity(CreateProductRequest dto, Business business);

    @Mapping(target = "name", source = "dto.name")
    @Mapping(target = "sku", source = "dto.sku")
    @Mapping(target = "unit", source = "dto.unit")
    @Mapping(target = "barCodeType", source = "dto.barCodeType")
    @Mapping(target = "expiredDate", source = "dto.expiredDate")
    @Mapping(target = "description", source = "dto.description")
    @Mapping(target = "previewImageUrl", source = "dto.previewImageUrl")
    @Mapping(target = "price", source = "dto.price")
    @Mapping(target = "variantMode", source = "dto.variantMode")
    @Mapping(target = "business", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "variants", ignore = true)
    void updateEntity(CreateProductRequest dto, @MappingTarget Product product);
}
