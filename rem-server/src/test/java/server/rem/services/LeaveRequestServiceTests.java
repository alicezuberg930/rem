package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import server.rem.dtos.leave_request.CreateLeaveRequest;
import server.rem.dtos.leave_request.QueryLeaveRequest;
import server.rem.entities.Business;
import server.rem.entities.LeaveRequest;
import server.rem.entities.User;
import server.rem.enums.LeaveStatus;
import server.rem.enums.LeaveType;
import server.rem.mappers.LeaveRequestMapper;
import server.rem.repositories.BusinessRepository;
import server.rem.repositories.LeaveRequestRepository;
import server.rem.repositories.UserRepository;

@ExtendWith(MockitoExtension.class)
class LeaveRequestServiceTests {
    @Mock
    private LeaveRequestRepository leaveRequestRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private BusinessRepository businessRepository;

    private LeaveRequestService leaveRequestService;

    @BeforeEach
    void setUp() {
        leaveRequestService = new LeaveRequestService(
                leaveRequestRepository, userRepository, businessRepository, Mappers.getMapper(LeaveRequestMapper.class));
    }

    @Test
    void createsPendingLeaveRequestForResolvedUserAndBusiness() {
        Business business = new Business();
        business.setId("business-id");
        User user = new User();
        user.setId("user-id");
        CreateLeaveRequest request = CreateLeaveRequest.builder()
                .businessId("business-id")
                .startDate(LocalDate.of(2026, 9, 10))
                .endDate(LocalDate.of(2026, 9, 11))
                .days(1.5)
                .type(LeaveType.ANNUAL)
                .reason("Annual leave")
                .build();
        when(businessRepository.findById("business-id")).thenReturn(Optional.of(business));
        when(userRepository.findById("user-id")).thenReturn(Optional.of(user));
        when(leaveRequestRepository.save(any(LeaveRequest.class))).thenAnswer(invocation -> invocation.getArgument(0));

        LeaveRequest response = leaveRequestService.createLeaveRequest("user-id", request);

        ArgumentCaptor<LeaveRequest> captor = ArgumentCaptor.forClass(LeaveRequest.class);
        verify(leaveRequestRepository).save(captor.capture());
        LeaveRequest savedRequest = captor.getValue();
        assertSame(savedRequest, response);
        assertSame(business, savedRequest.getBusiness());
        assertSame(user, savedRequest.getUser());
        assertEquals(request.getStartDate(), savedRequest.getStartDate());
        assertEquals(request.getEndDate(), savedRequest.getEndDate());
        assertEquals(request.getDays(), savedRequest.getDays());
        assertEquals(request.getType(), savedRequest.getType());
        assertEquals(request.getReason(), savedRequest.getReason());
        assertEquals(LeaveStatus.PENDING, savedRequest.getStatus());
        assertNull(savedRequest.getApprover());
        assertNull(savedRequest.getApproverNote());
        assertNull(savedRequest.getId());
    }

    @Test
    void returnsLeaveRequestsForResolvedUser() {
        User user = new User();
        List<LeaveRequest> leaveRequests = List.of(new LeaveRequest());
        when(userRepository.findById("user-id")).thenReturn(Optional.of(user));
        when(leaveRequestRepository.findAllByUser(user)).thenReturn(leaveRequests);

        assertSame(
                leaveRequests,
                leaveRequestService.getLeaveRequestByUser(
                        "user-id",
                        org.mockito.Mockito.mock(QueryLeaveRequest.class)
                )
        );
    }
}
