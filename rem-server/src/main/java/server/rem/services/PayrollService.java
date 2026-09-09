package server.rem.services;

import java.io.IOException;
import java.io.OutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
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
import server.rem.utils.ExportExcel;
import server.rem.utils.RemConstants;
import server.rem.utils.TaxCalculator;
import server.rem.utils.WorkingDaysCalculator;
import server.rem.utils.exceptions.ConflictException;
import server.rem.utils.exceptions.ResourceNotFoundException;

@Service
@AllArgsConstructor
public class PayrollService {
    private static final int EXPORT_PAGE_SIZE = 1_000;
    private static final int DEFAULT_COLUMN_WIDTH = 5_000;
    private static final String[] EXPORT_HEADERS = {
            "ID",
            "Created At",
            "Updated At",
            "Business ID",
            "Payroll Period ID",
            "Payroll Period Name",
            "Payroll Period Start Date",
            "Payroll Period End Date",
            "Payroll Period Status",
            "User ID",
            "User Fullname",
            "User Email",
            "User Phone",
            "Base Salary",
            "Total Allowances",
            "Total Bonuses",
            "Total Deductions",
            "Tax Amount",
            "Insurance Amount",
            "Net Salary",
            "Worked Days",
            "Absent Days",
            "Late Days",
            "Unpaid Leave Days",
            "Status",
            "Approver ID",
            "Approver Fullname",
            "Paid At"
    };

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
    private final EntityManager entityManager;

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

    @Transactional(readOnly = true)
    public void writeExcel(String businessId, OutputStream outputStream) throws IOException {
        SXSSFWorkbook workbook = ExportExcel.createWorkbook();
        try (workbook) {
            CellStyle headerStyle = ExportExcel.createHeaderStyle(workbook);
            int sheetNumber = 1;
            SXSSFSheet sheet = createExportSheet(workbook, sheetNumber, headerStyle);
            int rowIndex = 1;
            int pageNumber = 0;
            Slice<PayrollItem> page;

            do {
                page = payrollItemRepository.findAllByBusinessId(
                        businessId,
                        PageRequest.of(pageNumber, EXPORT_PAGE_SIZE, Sort.by(Sort.Direction.ASC, "id"))
                );
                for (PayrollItem payrollItem : page.getContent()) {
                    if (rowIndex == ExportExcel.MAX_ROWS_PER_SHEET) {
                        sheet = createExportSheet(workbook, ++sheetNumber, headerStyle);
                        rowIndex = 1;
                    }
                    writePayrollItem(sheet.createRow(rowIndex++), payrollItem);
                }
                entityManager.clear();
                pageNumber++;
            } while (page.hasNext());

            ExportExcel.write(workbook, outputStream);
        }
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

    private SXSSFSheet createExportSheet(SXSSFWorkbook workbook, int sheetNumber, CellStyle headerStyle) {
        String name = sheetNumber == 1 ? "Payroll" : "Payroll " + sheetNumber;
        return ExportExcel.createSheet(
                workbook,
                name,
                EXPORT_HEADERS,
                headerStyle,
                columnIndex -> DEFAULT_COLUMN_WIDTH
        );
    }

    private void writePayrollItem(Row row, PayrollItem payrollItem) {
        PayrollPeriod period = payrollItem.getPayrollPeriod();
        User user = payrollItem.getUser();
        User approver = payrollItem.getApprover();
        int columnIndex = 0;

        ExportExcel.setCellValue(row, columnIndex++, payrollItem.getId());
        ExportExcel.setCellValue(row, columnIndex++, payrollItem.getCreatedAt());
        ExportExcel.setCellValue(row, columnIndex++, payrollItem.getUpdatedAt());
        ExportExcel.setCellValue(row, columnIndex++, payrollItem.getBusiness().getId());
        ExportExcel.setCellValue(row, columnIndex++, period.getId());
        ExportExcel.setCellValue(row, columnIndex++, period.getName());
        ExportExcel.setCellValue(row, columnIndex++, period.getStartDate());
        ExportExcel.setCellValue(row, columnIndex++, period.getEndDate());
        ExportExcel.setCellValue(row, columnIndex++, period.getStatus());
        ExportExcel.setCellValue(row, columnIndex++, user.getId());
        ExportExcel.setCellValue(row, columnIndex++, user.getFullname());
        ExportExcel.setCellValue(row, columnIndex++, user.getEmail());
        ExportExcel.setCellValue(row, columnIndex++, user.getPhone());
        ExportExcel.setCellValue(row, columnIndex++, payrollItem.getBaseSalary());
        ExportExcel.setCellValue(row, columnIndex++, payrollItem.getTotalAllowances());
        ExportExcel.setCellValue(row, columnIndex++, payrollItem.getTotalBonuses());
        ExportExcel.setCellValue(row, columnIndex++, payrollItem.getTotalDeductions());
        ExportExcel.setCellValue(row, columnIndex++, payrollItem.getTaxAmount());
        ExportExcel.setCellValue(row, columnIndex++, payrollItem.getInsuranceAmount());
        ExportExcel.setCellValue(row, columnIndex++, payrollItem.getNetSalary());
        ExportExcel.setCellValue(row, columnIndex++, payrollItem.getWorkedDays());
        ExportExcel.setCellValue(row, columnIndex++, payrollItem.getAbsentDays());
        ExportExcel.setCellValue(row, columnIndex++, payrollItem.getLateDays());
        ExportExcel.setCellValue(row, columnIndex++, payrollItem.getUnpaidLeaveDays());
        ExportExcel.setCellValue(row, columnIndex++, payrollItem.getStatus());
        ExportExcel.setCellValue(row, columnIndex++, approver == null ? null : approver.getId());
        ExportExcel.setCellValue(row, columnIndex++, approver == null ? null : approver.getFullname());
        ExportExcel.setCellValue(row, columnIndex, payrollItem.getPaidAt());
    }
}
