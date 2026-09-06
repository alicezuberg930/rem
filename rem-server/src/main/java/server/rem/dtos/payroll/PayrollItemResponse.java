package server.rem.dtos.payroll;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import server.rem.enums.PayrollStatus;

@Getter
@Builder
@AllArgsConstructor
public class PayrollItemResponse {
    private final String id;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;
    private final String businessId;
    private final String payrollPeriodId;
    private final String payrollPeriodName;
    private final LocalDate payrollPeriodStartDate;
    private final LocalDate payrollPeriodEndDate;
    private final PayrollStatus payrollPeriodStatus;
    private final String userId;
    private final String userFullname;
    private final String userEmail;
    private final String userPhone;
    private final Integer baseSalary;
    private final Double totalAllowances;
    private final Double totalBonuses;
    private final Double totalDeductions;
    private final Double taxAmount;
    private final Double insuranceAmount;
    private final Double netSalary;
    private final Integer workedDays;
    private final Integer absentDays;
    private final Integer lateDays;
    private final Integer unpaidLeaveDays;
    private final PayrollStatus status;
    private final String approverId;
    private final String approverFullname;
    private final LocalDateTime paidAt;
}
