package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Optional;

import jakarta.persistence.EntityManager;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import server.rem.dtos.payroll.CreatePayrollPeriodRequest;
import server.rem.entities.Business;
import server.rem.entities.PayrollPeriod;
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
import server.rem.utils.TaxCalculator;
import server.rem.utils.WorkingDaysCalculator;

@ExtendWith(MockitoExtension.class)
class PayrollServiceTests {
    @Mock
    private BusinessUserRepository businessUserRepository;
    @Mock
    private PayrollPeriodRepository payrollPeriodRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private AttendanceRepository attendanceRepository;
    @Mock
    private LeaveRequestRepository leaveRequestRepository;
    @Mock
    private PayrollItemRepository payrollItemRepository;
    @Mock
    private AllowanceRepository allowanceRepository;
    @Mock
    private BusinessRepository businessRepository;
    @Mock
    private HolidayRepository holidayRepository;
    @Mock
    private WorkingDaysCalculator workingDaysCalculator;
    @Mock
    private TaxCalculator taxCalculator;
    @Mock
    private EntityManager entityManager;

    private PayrollService payrollService;

    @BeforeEach
    void setUp() {
        payrollService = new PayrollService(
                businessUserRepository,
                payrollPeriodRepository,
                userRepository,
                attendanceRepository,
                leaveRequestRepository,
                payrollItemRepository,
                allowanceRepository,
                businessRepository,
                holidayRepository,
                workingDaysCalculator,
                taxCalculator,
                entityManager,
                Mappers.getMapper(PayrollPeriodMapper.class)
        );
    }

    @Test
    void createsDraftPayrollPeriodForResolvedBusiness() {
        Business business = Business.builder().name("REM").build();
        business.setId("business-id");
        CreatePayrollPeriodRequest request = new CreatePayrollPeriodRequest(
                "business-id", "September payroll", LocalDate.of(2026, 9, 1), LocalDate.of(2026, 9, 30));
        when(businessRepository.findById("business-id")).thenReturn(Optional.of(business));

        PayrollPeriod period = payrollService.createPeriod(request);

        assertSame(business, period.getBusiness());
        assertEquals(request.getName(), period.getName());
        assertEquals(request.getStartDate(), period.getStartDate());
        assertEquals(request.getEndDate(), period.getEndDate());
        assertEquals(PayrollStatus.DRAFT, period.getStatus());
        assertNull(period.getId());
        assertNull(period.getItems());
    }

    @Test
    void submitsDraftPayrollPeriodForProcessing() {
        PayrollPeriod period = PayrollPeriod.builder().status(PayrollStatus.DRAFT).build();
        when(payrollPeriodRepository.findById("period-id")).thenReturn(Optional.of(period));
        when(payrollPeriodRepository.save(period)).thenReturn(period);

        assertSame(period, payrollService.submitPayrollPeriod("period-id"));
        assertEquals(PayrollStatus.PROCESSING, period.getStatus());
    }
}
