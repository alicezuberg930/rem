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

import server.rem.dtos.customer_group.QueryCustomerGroup;
import server.rem.entities.Business;
import server.rem.entities.CustomerGroup;
import server.rem.mappers.CustomerGroupMapper;
import server.rem.repositories.BusinessRepository;
import server.rem.repositories.CustomerGroupRepository;

@ExtendWith(MockitoExtension.class)
class CustomerGroupServiceTests {
    @Mock
    private CustomerGroupRepository customerGroupRepository;
    @Mock
    private BusinessRepository businessRepository;
    @Mock
    private CustomerGroupMapper customerGroupMapper;

    private CustomerGroupService customerGroupService;

    @BeforeEach
    void setUp() {
        customerGroupService = new CustomerGroupService(
                customerGroupRepository,
                businessRepository,
                customerGroupMapper
        );
    }

    @Test
    void returnsGroupsForBusiness() {
        Business business = new Business();
        List<CustomerGroup> groups = List.of(new CustomerGroup());
        when(businessRepository.findById("business-id")).thenReturn(Optional.of(business));
        when(customerGroupRepository.findByBusiness(business)).thenReturn(groups);

        assertSame(groups, customerGroupService.getAll(new QueryCustomerGroup(20, 0), "business-id"));
    }
}
