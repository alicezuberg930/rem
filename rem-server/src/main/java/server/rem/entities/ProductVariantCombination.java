package server.rem.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
        name = "product_variant_combinations",
        uniqueConstraints = @UniqueConstraint(columnNames = {"product_id", "variant_value_1_id", "variant_value_2_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariantCombination extends Base {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "sku", length = 255, nullable = false)
    private String sku;

    @Column(name = "price", length = 255, nullable = false)
    private Long price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_value_1_id", nullable = false)
    private VariantValue variantValue1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_value_2_id", nullable = false)
    private VariantValue variantValue2;
}
