package server.rem.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "variants",
    uniqueConstraints = @UniqueConstraint(columnNames = { "business_id", "name" })
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Variant extends Base {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @Column(name = "name", length = 255, nullable = false)
    private String name;

    @OneToMany(mappedBy = "variant", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt ASC")
    @Builder.Default
    private List<VariantOption> options = new ArrayList<>();

    @ManyToMany(mappedBy = "variants", fetch = FetchType.LAZY)
    private List<Product> products;
}
