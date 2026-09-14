package server.rem.entities;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;
import server.rem.enums.PayrollStatus;

@Entity
@Table(name = "payroll_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollItem extends Base {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payroll_period_id", nullable = false)
    private PayrollPeriod payrollPeriod;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "base_salary", nullable = false)
    private Integer baseSalary;

    @Column(name = "total_allowances", nullable = false)
    @Builder.Default
    private Double totalAllowances = 0.0;

    @Column(name = "total_bonuses", nullable = false)
    @Builder.Default
    private Double totalBonuses = 0.0;

    @Column(name = "total_deductions", nullable = false)
    @Builder.Default
    private Double totalDeductions = 0.0;

    @Column(name = "tax_amount", nullable = false)
    @Builder.Default
    private Double taxAmount = 0.0;

    @Column(name = "insurance_amount", nullable = false)
    @Builder.Default
    private Double insuranceAmount = 0.0;

    @Column(name = "net_salary", nullable = false)
    @Builder.Default
    private Double netSalary = 0.0;

    @Column(name = "worked_days")
    private Integer workedDays;

    @Column(name = "absent_days")
    private Integer absentDays;

    @Column(name = "late_days")
    private Integer lateDays;

    @Column(name = "unpaid_leave_days")
    private Integer unpaidLeaveDays;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private PayrollStatus status = PayrollStatus.DRAFT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approver_id")
    private User approver;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @OneToMany(mappedBy = "payrollItem", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PayrollBonus> bonuses;

    @OneToMany(mappedBy = "payrollItem", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PayrollDeduction> deductions;
}
