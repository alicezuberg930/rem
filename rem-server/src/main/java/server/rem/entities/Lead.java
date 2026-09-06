package server.rem.entities;

import jakarta.persistence.*;
import lombok.*;
import server.rem.enums.LeadSource;
import server.rem.enums.LeadStatus;

@Entity
@Table(name = "leads", uniqueConstraints = @UniqueConstraint(columnNames = "contact_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lead extends Base {
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id", nullable = false)
    private Contact contact;

    @Column(name = "source", nullable = false)
    @Enumerated(EnumType.STRING)
    private LeadSource source;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private LeadStatus status = LeadStatus.NEW;
}
