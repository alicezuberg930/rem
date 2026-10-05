package server.rem.dtos.product;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import server.rem.enums.BarCodeType;
import server.rem.enums.VariantMode;

@Getter
@AllArgsConstructor
public class CreateProductRequest {
    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name must be at most 255 characters")
    private final String name;

    @NotBlank(message = "SKU is required")
    @Size(max = 255, message = "SKU must be at most 255 characters")
    private final String sku;

    @NotBlank(message = "Unit is required")
    @Size(max = 255, message = "Unit must be at most 255 characters")
    private final String unit;

    @NotNull(message = "Bar code type is required")
    private final BarCodeType barCodeType;

    private final LocalDate expiredDate;

    @Size(max = 65535, message = "Description is too long")
    private final String description;

    @Size(max = 255, message = "Preview image URL must be at most 255 characters")
    private final String previewImageUrl;

    @PositiveOrZero(message = "Price must be zero or greater")
    private final Long price;

    @NotNull(message = "Variant mode is required")
    private final VariantMode variantMode;

    @Size(max = 2, message = "A product can have at most two variants")
    private final List<@NotBlank(message = "Variant ID is required") @Size(max = 24, message = "Variant ID must be at most 24 characters") String> variantIds;

    @Valid
    private final List<@NotNull(message = "Combination is required") ProductVariantCombinationRequest> combinations;

    @Getter
    @AllArgsConstructor
    public static class ProductVariantCombinationRequest {
        @Size(max = 24, message = "Combination ID must be at most 24 characters")
        private final String id;

        @Size(max = 2, message = "A combination can have at most two variant options")
        private final List<@NotBlank(message = "Variant option ID is required") @Size(max = 24, message = "Variant option ID must be at most 24 characters") String> variantOptionIds;

        @NotBlank(message = "Combination SKU is required")
        @Size(max = 255, message = "Combination SKU must be at most 255 characters")
        private final String sku;

        @NotNull(message = "Combination price is required")
        @PositiveOrZero(message = "Combination price must be zero or greater")
        private final Long price;
    }
}
