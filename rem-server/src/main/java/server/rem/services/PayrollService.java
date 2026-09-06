package server.rem.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import server.rem.dtos.CustomPageResponse;
import server.rem.dtos.QueryPaginate;
import server.rem.dtos.payroll.CreatePayrollPeriodRequest;
import server.rem.dtos.payroll.PayrollItemResponse;
import server.rem.entities.Allowance;
import server.rem.entities.Attendance;
import server.rem.entities.Business;
import server.rem.entities.BusinessUser;
import server.rem.entities.Holiday;
import server.rem.entities.PayrollItem;
import server.rem.entities.PayrollPeriod;
import server.rem.entities.User;
import server.rem.enums.CheckInStatus;
import server.rem.enums.LeaveStatus;
import server.rem.enums.LeaveType;
import server.rem.enums.PayrollStatus;
import server.rem.mappers.PayrollPeriodMapper;
import server.rem.repositories.AllowanceRepository;
import server.rem.repositories.AttendanceRepository;
import server.rem.repositories.BusinessRepository;
import server.rem.repositories.BusinessUserRepository;
import server.rem.repositories.HolidayRepository;
import server.rem.repositories.LeaveRequestRepository;
import server.rem.repositories.PayrollItemRepository;
import server.rem.repositories.PayrollPeriodRepository;
import server.rem.repositories.UserRepository;
import server.rem.utils.RemConstants;
import server.rem.utils.TaxCalculator;
import server.rem.utils.WorkingDaysCalculator;
import server.rem.utils.exceptions.ConflictException;
import server.rem.utils.exceptions.ResourceNotFoundException;

@Service
@AllArgsConstructor
public class PayrollService {
    private final BusinessUserRepository businessUserRepository;
    private final PayrollPeriodRepository payrollPeriodRepository;
    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final PayrollItemRepository payrollItemRepository;
    private final AllowanceRepository allowanceRepository;
    private final BusinessRepository businessRepository;
    private final HolidayRepository holidayRepository;
    private final WorkingDaysCalculator workingDaysCalculator;
    private final TaxCalculator taxCalculator;

    public CustomPageResponse<PayrollItemResponse> getItems(String businessId, QueryPaginate dto) {
        Pageable pageable = PageRequest.of(dto.getPage(), dto.getPageSize());
        Page<PayrollItemResponse> result = payrollItemRepository.findByBusinessId(businessId, pageable)
                .map(this::toPayrollItemResponse);
        return new CustomPageResponse<>(result);
    }

    public PayrollPeriod createPeriod(CreatePayrollPeriodRequest dto) {
        Business business = businessRepository.findById(dto.getBusinessId())
                .orElseThrow(() -> new ResourceNotFoundException("No business found"));
        PayrollPeriod payrollPeriod = PayrollPeriodMapper.toEntity(dto);
        payrollPeriod.setBusiness(business);
        return payrollPeriod;
    }

    public PayrollItem generateEmployeePayroll(String userId, String periodId) {
        PayrollPeriod period = payrollPeriodRepository.findById(periodId)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll period not found"));

        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Get base salary of employeee from business_user
        BusinessUser businessUser = businessUserRepository.findByBusinessAndUser(period.getBusiness(), user)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found in business"));

        // Count employee's checkins in a period
        List<Attendance> attendances = attendanceRepository.findByUserAndBusinessAndDateBetween(user,
                period.getBusiness(), period.getStartDate(), period.getEndDate());

        // Get holidays in period
        List<LocalDate> holidays = holidayRepository
                .findByBusinessAndDateBetween(period.getBusiness(), period.getStartDate(), period.getEndDate())
                .stream()
                .map(Holiday::getDate)
                .toList();

        // Calculate supposed working days in the period
        int totalWorkingDays = workingDaysCalculator.calculateWorkingDays(
                period.getStartDate(),
                period.getEndDate(),
                holidays);

        // employee's actual worked days
        int actualWorkedDays = workingDaysCalculator.calculateActualWorkedDays(
                period.getStartDate(),
                period.getEndDate(),
                holidays,
                attendances);

        // Count unpaid leaves in period
        int unpaidLeaveDays = leaveRequestRepository
                .findByUserAndBusinessAndTypeAndStatusAndStartDateGreaterThanEqualAndEndDateLessThanEqual(user,
                        period.getBusiness(), LeaveType.UNPAID, LeaveStatus.APPROVED, period.getStartDate(),
                        period.getEndDate())
                .stream()
                .mapToInt(l -> l.getDays().intValue())
                .sum();

        int absentDays = totalWorkingDays - actualWorkedDays - unpaidLeaveDays;
        int lateDays = (int) attendances.stream().filter(a -> a.getStatus() == CheckInStatus.LATE).count();

        int baseSalary = businessUser.getSalary();
        double dailyRate = (double) baseSalary / totalWorkingDays;
        double earnedSalary = (double) (dailyRate * (actualWorkedDays - unpaidLeaveDays - absentDays));

        // Sum allowances
        double totalAllowances = allowanceRepository.findByBusinessAndIsActive(period.getBusiness(), user, true)
                .stream()
                .mapToInt(Allowance::getAmount)
                .sum();

        // Calculate insurance based on salary or lower salary
        int insuranceContributionSalary = period.getBusiness().getInsuranceContributionSalary();
        double insuranceAmount = 0;
        if (insuranceContributionSalary > 0) {
            insuranceAmount = insuranceContributionSalary * RemConstants.HEALTH_INSURANCE_RATE + insuranceContributionSalary * RemConstants.SOCIAL_INSURANCE_RATE + insuranceContributionSalary * RemConstants.UNEMPLOYMENT_INSURANCE_RATE;
        } else {
            insuranceAmount = earnedSalary * RemConstants.HEALTH_INSURANCE_RATE + earnedSalary * RemConstants.SOCIAL_INSURANCE_RATE + earnedSalary * RemConstants.UNEMPLOYMENT_INSURANCE_RATE;
        }

        // Calculate tax after reducing insurance
        double taxAmount = 0;
        double taxableIncome = earnedSalary - RemConstants.SELF_CIRCUMSTANCE_DEDUCTION - (RemConstants.FAMILY_CIRCUMSTANCE_DEDUCTION * businessUser.getDependants());
        if (taxableIncome > 0) {
            taxAmount = taxCalculator.calculate(taxableIncome);
        }

        double totalDeductions = insuranceAmount + taxAmount;

        double netSalary = earnedSalary + totalAllowances - totalDeductions;

        PayrollItem record = PayrollItem.builder()
                .payrollPeriod(period)
                .business(period.getBusiness())
                .user(user)
                .baseSalary(baseSalary)
                .totalAllowances(totalAllowances)
                .totalDeductions(totalDeductions)
                .taxAmount(taxAmount)
                .insuranceAmount(insuranceAmount)
                .netSalary(netSalary)
                .workedDays(actualWorkedDays)
                .absentDays(absentDays)
                .lateDays(lateDays)
                .unpaidLeaveDays(unpaidLeaveDays)
                .build();

        return payrollItemRepository.save(record);
    }

    // for HR authorization
    public PayrollPeriod submitPayrollPeriod(String periodId) {
        PayrollPeriod period = payrollPeriodRepository.findById(periodId)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll period not found"));

        if (period.getStatus() != PayrollStatus.DRAFT) {
            throw new ConflictException("Payroll period is not in DRAFT status");
        }

        period.setStatus(PayrollStatus.PROCESSING);
        return payrollPeriodRepository.save(period);
    }

    // admin & manager authorization
    public PayrollPeriod approvePayrollPeriod(String periodId, String approverId) {
        PayrollPeriod period = payrollPeriodRepository.findById(periodId)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll period not found"));

        if (period.getStatus() != PayrollStatus.PROCESSING) {
            throw new ConflictException("Payroll period is not in PROCESSING status");
        }

        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new ResourceNotFoundException("Approver not found"));

        // Approve all items in the period
        List<PayrollItem> items = payrollItemRepository.findByPayrollPeriod(period);
        items.forEach(item -> {
            item.setStatus(PayrollStatus.APPROVED);
            item.setApprover(approver);
        });
        payrollItemRepository.saveAll(items);

        period.setStatus(PayrollStatus.APPROVED);
        return payrollPeriodRepository.save(period);
    }

    public PayrollItem getEmployeePayslip(String periodId, String userId) {
        PayrollPeriod payrollPeriod = payrollPeriodRepository.findById(periodId)
                .orElseThrow(() -> new ResourceNotFoundException("No payroll period found"));

        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        PayrollItem payrollItem = payrollItemRepository.findByPayrollPeriodAndUser(payrollPeriod, user)
                .orElseThrow(() -> new ResourceNotFoundException("Employee payslip not found"));

        return payrollItem;
    }

    // HR is authorized
    public PayrollPeriod markAsPaid(String periodId) {
        PayrollPeriod period = payrollPeriodRepository.findById(periodId)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll period not found"));

        if (period.getStatus() != PayrollStatus.APPROVED) {
            throw new ConflictException("Payroll period is not approved yet");
        }

        List<PayrollItem> items = payrollItemRepository.findByPayrollPeriod(period);
        items.forEach(item -> {
            item.setStatus(PayrollStatus.PAID);
            item.setPaidAt(LocalDateTime.now());
        });
        payrollItemRepository.saveAll(items);

        period.setStatus(PayrollStatus.PAID);
        return payrollPeriodRepository.save(period);
    }

    // Generate all records for all employees in a period
    public List<PayrollItem> generateAllEmployeePayroll(String periodId) {
        PayrollPeriod period = payrollPeriodRepository.findById(periodId)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll period not found"));

        List<BusinessUser> employees = businessUserRepository.findByBusiness(period.getBusiness());

        return employees.stream()
                .map(e -> generateEmployeePayroll(e.getUser().getId(), periodId))
                .toList();
    }

    private PayrollItemResponse toPayrollItemResponse(PayrollItem payrollItem) {
        PayrollPeriod period = payrollItem.getPayrollPeriod();
        User user = payrollItem.getUser();
        User approver = payrollItem.getApprover();

        return PayrollItemResponse.builder()
                .id(payrollItem.getId())
                .createdAt(payrollItem.getCreatedAt())
                .updatedAt(payrollItem.getUpdatedAt())
                .businessId(payrollItem.getBusiness().getId())
                .payrollPeriodId(period.getId())
                .payrollPeriodName(period.getName())
                .payrollPeriodStartDate(period.getStartDate())
                .payrollPeriodEndDate(period.getEndDate())
                .payrollPeriodStatus(period.getStatus())
                .userId(user.getId())
                .userFullname(user.getFullname())
                .userEmail(user.getEmail())
                .userPhone(user.getPhone())
                .baseSalary(payrollItem.getBaseSalary())
                .totalAllowances(payrollItem.getTotalAllowances())
                .totalBonuses(payrollItem.getTotalBonuses())
                .totalDeductions(payrollItem.getTotalDeductions())
                .taxAmount(payrollItem.getTaxAmount())
                .insuranceAmount(payrollItem.getInsuranceAmount())
                .netSalary(payrollItem.getNetSalary())
                .workedDays(payrollItem.getWorkedDays())
                .absentDays(payrollItem.getAbsentDays())
                .lateDays(payrollItem.getLateDays())
                .unpaidLeaveDays(payrollItem.getUnpaidLeaveDays())
                .status(payrollItem.getStatus())
                .approverId(approver != null ? approver.getId() : null)
                .approverFullname(approver != null ? approver.getFullname() : null)
                .paidAt(payrollItem.getPaidAt())
                .build();
    }
}
