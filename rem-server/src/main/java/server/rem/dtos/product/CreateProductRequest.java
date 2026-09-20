package server.rem.dtos.product;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    private final Long price;

    private final VariantMode variantMode;
}
