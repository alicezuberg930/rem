package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import server.rem.dtos.leave_request.QueryLeaveRequest;
import server.rem.entities.LeaveRequest;
import server.rem.entities.User;
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
        leaveRequestService = new LeaveRequestService(leaveRequestRepository, userRepository, businessRepository);
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
