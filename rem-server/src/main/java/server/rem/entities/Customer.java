package server.rem.entities;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "customers", uniqueConstraints = @UniqueConstraint(columnNames = "contact_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer extends Base {
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id", nullable = false)
    private Contact contact;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_group_id")
    private CustomerGroup customerGroup;

    @Column(name = "customer_since", nullable = false)
    @Builder.Default
    private LocalDate customerSince = LocalDate.now();
}
