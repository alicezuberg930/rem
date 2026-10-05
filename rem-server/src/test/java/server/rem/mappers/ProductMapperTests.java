package server.rem.mappers;

import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.Test;

import server.rem.dtos.product.CreateProductRequest;
import server.rem.entities.Product;
import server.rem.enums.BarCodeType;
import server.rem.enums.VariantMode;

class ProductMapperTests {
    private final ProductMapper productMapper = new ProductMapperImpl();

    @Test
    void updateCanClearNullableScalarFields() {
        Product product = Product.builder()
                .name("Old name")
                .sku("OLD-SKU")
                .unit("piece")
                .barCodeType(BarCodeType.CODE_128)
                .description("Old description")
                .previewImageUrl("https://example.com/old.png")
                .price(100L)
                .variantMode(VariantMode.SIMPLE)
                .build();
        CreateProductRequest request = new CreateProductRequest(
                "New name",
                "NEW-SKU",
                "piece",
                BarCodeType.CODE_128,
                null,
                null,
                null,
                null,
                VariantMode.VARIABLE,
                java.util.List.of("variant-1"),
                null);

        productMapper.updateEntity(request, product);

        assertNull(product.getExpiredDate());
        assertNull(product.getDescription());
        assertNull(product.getPreviewImageUrl());
        assertNull(product.getPrice());
    }
}
