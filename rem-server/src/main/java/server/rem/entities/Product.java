package server.rem.entities;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import server.rem.enums.BarCodeType;
import server.rem.enums.VariantMode;

@Entity
@Table(
    name = "products",
    indexes = @Index(name = "idx_products_business_id_name", columnList = "business_id, name")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product extends Base {
    @Column(name = "name", length = 255, nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @Column(name = "sku", length = 255, nullable = false)
    private String sku;

    @Column(name = "unit", length = 255, nullable = false)
    private String unit;

    @Enumerated(EnumType.STRING)
    @Column(name = "bar_code_type", nullable = false)
    @Builder.Default
    private BarCodeType barCodeType = BarCodeType.CODE_128;

    @Column(name = "expired_date")
    private LocalDate expiredDate;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "preview_image_url", length = 255)
    private String previewImageUrl;

    @Column(name = "price")
    private Long price;

    @Enumerated(EnumType.STRING)
    @Column(name = "variant_mode", nullable = false)
    @Builder.Default
    private VariantMode variantMode = VariantMode.SIMPLE;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "product_variants",
        joinColumns = @JoinColumn(name = "product_id"),
        inverseJoinColumns = @JoinColumn(name = "variant_id")
    )
    private List<Variant> variants;
}
