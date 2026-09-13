package server.rem.services;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertSame;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import server.rem.dtos.business.BusinessResponse;
import server.rem.entities.Business;
import server.rem.mappers.BusinessMapper;
import server.rem.repositories.BusinessRepository;
import server.rem.repositories.BusinessUserRepository;
import server.rem.repositories.RoleRepository;
import server.rem.repositories.UserRepository;
import server.rem.utils.mail.DynamicMail;

@ExtendWith(MockitoExtension.class)
class BusinessServiceTests {
    @Mock
    private BusinessUserRepository businessUserRepository;
    @Mock
    private BusinessRepository businessRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private EmailService emailService;
    @Mock
    private BusinessMapper businessMapper;
    @Mock
    private DynamicMail dynamicMail;
    @Mock
    private RoleRepository roleRepository;

    private BusinessService businessService;

    @BeforeEach
    void setUp() {
        businessService = new BusinessService(
                businessUserRepository,
                businessRepository,
                userRepository,
                emailService,
                businessMapper,
                dynamicMail,
                roleRepository
        );
    }

    @Test
    void returnsAllBusinessesForAdministrativeRequest() {
        List<Business> businesses = List.of(new Business());
        List<BusinessResponse> responses = List.of(org.mockito.Mockito.mock(BusinessResponse.class));
        when(businessRepository.findAll()).thenReturn(businesses);
        when(businessMapper.toBusinessesResponse(businesses)).thenReturn(responses);

        assertSame(responses, businessService.getAll(null));
    }
}
