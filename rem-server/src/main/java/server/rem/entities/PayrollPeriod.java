package server.rem.entities;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;
import server.rem.enums.PayrollStatus;

@Entity
@Table(name = "payroll_periods")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollPeriod extends Base {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private PayrollStatus status = PayrollStatus.DRAFT;

    @OneToMany(mappedBy = "payrollPeriod", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PayrollItem> items;
}
