package server.rem.entities;

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

    @ManyToMany(mappedBy = "variants", fetch = FetchType.LAZY)
    private List<Product> products;
}
