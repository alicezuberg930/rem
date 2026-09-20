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
    name = "variant_values",
    uniqueConstraints = @UniqueConstraint(columnNames = { "variant_id", "name" })
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VariantValue extends Base {
    @Column(name = "name", length = 255, nullable = false)
    private String name;

    @Column(name = "value", length = 255, nullable = false)
    private String value;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false)
    private Variant variant;
}

