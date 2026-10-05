package server.rem.dtos.product;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import server.rem.dtos.variant.VariantResponse;
import server.rem.enums.BarCodeType;
import server.rem.enums.VariantMode;

@Getter
@AllArgsConstructor
public class ProductResponse {
    private final String id;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;
    private final String name;
    private final String sku;
    private final String unit;
    private final BarCodeType barCodeType;
    private final LocalDate expiredDate;
    private final String description;
    private final String previewImageUrl;
    private final Long price;
    private final VariantMode variantMode;
    private final List<VariantResponse> variants;
    private final List<ProductVariantCombinationResponse> combinations;

    @Getter
    @AllArgsConstructor
    public static class ProductVariantCombinationResponse {
        private final String id;
        private final String sku;
        private final Long price;
        private final List<VariantResponse.VariantOptionResponse> variantOptions;
    }
}
