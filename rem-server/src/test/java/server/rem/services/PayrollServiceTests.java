package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import server.rem.entities.PayrollPeriod;
import server.rem.enums.PayrollStatus;
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
                taxCalculator
        );
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
