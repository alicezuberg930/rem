package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import server.rem.dtos.contact.ContactResponse;
import server.rem.dtos.customer.CreateCustomerRequest;
import server.rem.dtos.customer.CustomerResponse;
import server.rem.entities.Business;
import server.rem.entities.Contact;
import server.rem.entities.Customer;
import server.rem.entities.CustomerGroup;
import server.rem.mappers.ContactMapper;
import server.rem.repositories.ContactRepository;
import server.rem.repositories.CustomerGroupRepository;
import server.rem.repositories.CustomerRepository;
import server.rem.utils.exceptions.ConflictException;
import server.rem.utils.exceptions.ResourceNotFoundException;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTests {
    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private ContactRepository contactRepository;
    @Mock
    private CustomerGroupRepository customerGroupRepository;
    @Mock
    private ContactMapper contactMapper;

    private CustomerService customerService;

    @BeforeEach
    void setUp() {
        customerService = new CustomerService(
                customerRepository,
                contactRepository,
                customerGroupRepository,
                contactMapper
        );
    }

    @Test
    void createPersistsCustomerForBusinessContact() {
        Business business = business("business-1");
        Contact contact = contact("contact-1", business);
        CustomerGroup customerGroup = customerGroup("group-1", business);
        CreateCustomerRequest request = new CreateCustomerRequest(
                "contact-1",
                "group-1",
                LocalDate.of(2026, 1, 10)
        );

        when(contactRepository.findByIdAndBusiness_Id("contact-1", "business-1"))
                .thenReturn(Optional.of(contact));
        when(customerRepository.existsByContact_Id("contact-1")).thenReturn(false);
        when(customerGroupRepository.findById("group-1")).thenReturn(Optional.of(customerGroup));
        when(customerRepository.save(any(Customer.class))).thenAnswer(invocation -> {
            Customer customer = invocation.getArgument(0);
            customer.setId("customer-1");
            return customer;
        });
        when(contactMapper.toContactResponse(contact)).thenReturn(contactResponse("contact-1"));

        CustomerResponse response = customerService.create(request, "business-1");

        ArgumentCaptor<Customer> captor = ArgumentCaptor.forClass(Customer.class);
        verify(customerRepository).save(captor.capture());
        assertSame(contact, captor.getValue().getContact());
        assertSame(customerGroup, captor.getValue().getCustomerGroup());
        assertEquals(LocalDate.of(2026, 1, 10), captor.getValue().getCustomerSince());
        assertEquals("customer-1", response.getId());
        assertEquals("group-1", response.getCustomerGroup().getId());
    }

    @Test
    void createRejectsExistingCustomerContact() {
        Contact contact = contact("contact-1", business("business-1"));
        CreateCustomerRequest request = new CreateCustomerRequest("contact-1", null, null);

        when(contactRepository.findByIdAndBusiness_Id("contact-1", "business-1"))
                .thenReturn(Optional.of(contact));
        when(customerRepository.existsByContact_Id("contact-1")).thenReturn(true);

        assertThrows(ConflictException.class, () -> customerService.create(request, "business-1"));
        verify(customerRepository, never()).save(any(Customer.class));
    }

    @Test
    void updatePreservesCustomerSinceWhenRequestOmitsIt() {
        Business business = business("business-1");
        Contact contact = contact("contact-1", business);
        Customer customer = Customer.builder()
                .contact(contact)
                .customerSince(LocalDate.of(2025, 12, 1))
                .build();
        customer.setId("customer-1");
        CreateCustomerRequest request = new CreateCustomerRequest("contact-1", null, null);

        when(customerRepository.findByIdAndContact_Business_Id("customer-1", "business-1"))
                .thenReturn(Optional.of(customer));
        when(contactRepository.findByIdAndBusiness_Id("contact-1", "business-1"))
                .thenReturn(Optional.of(contact));
        when(customerRepository.existsByContact_IdAndIdNot("contact-1", "customer-1")).thenReturn(false);
        when(customerRepository.save(customer)).thenReturn(customer);
        when(contactMapper.toContactResponse(contact)).thenReturn(contactResponse("contact-1"));

        CustomerResponse response = customerService.update("customer-1", request, "business-1");

        assertEquals(LocalDate.of(2025, 12, 1), response.getCustomerSince());
        assertNull(response.getCustomerGroup());
        verify(customerRepository).save(customer);
    }

    @Test
    void deleteScopesCustomerByBusiness() {
        Customer customer = Customer.builder()
                .contact(contact("contact-1", business("business-1")))
                .customerSince(LocalDate.of(2026, 1, 1))
                .build();
        customer.setId("customer-1");

        when(customerRepository.findByIdAndContact_Business_Id("customer-1", "business-1"))
                .thenReturn(Optional.of(customer));

        customerService.delete("customer-1", "business-1");

        verify(customerRepository).delete(customer);
    }

    @Test
    void updateRejectsCustomerGroupFromAnotherBusiness() {
        Business business = business("business-1");
        Contact contact = contact("contact-1", business);
        Customer customer = Customer.builder().contact(contact).customerSince(LocalDate.of(2026, 1, 1)).build();
        customer.setId("customer-1");
        CreateCustomerRequest request = new CreateCustomerRequest(
                "contact-1",
                "group-2",
                LocalDate.of(2026, 1, 2)
        );

        when(customerRepository.findByIdAndContact_Business_Id("customer-1", "business-1"))
                .thenReturn(Optional.of(customer));
        when(contactRepository.findByIdAndBusiness_Id("contact-1", "business-1"))
                .thenReturn(Optional.of(contact));
        when(customerRepository.existsByContact_IdAndIdNot("contact-1", "customer-1")).thenReturn(false);
        when(customerGroupRepository.findById("group-2"))
                .thenReturn(Optional.of(customerGroup("group-2", business("business-2"))));

        assertThrows(ResourceNotFoundException.class, () -> customerService.update("customer-1", request, "business-1"));
        verify(customerRepository, never()).save(any(Customer.class));
    }

    private static Business business(String id) {
        Business business = Business.builder().name("REM").build();
        business.setId(id);
        return business;
    }

    private static Contact contact(String id, Business business) {
        Contact contact = Contact.builder()
                .business(business)
                .firstName("Jane")
                .lastName("Doe")
                .phone("0123456789")
                .email("jane@example.com")
                .build();
        contact.setId(id);
        return contact;
    }

    private static CustomerGroup customerGroup(String id, Business business) {
        CustomerGroup customerGroup = CustomerGroup.builder()
                .business(business)
                .name("VIP")
                .percentage(10.0)
                .build();
        customerGroup.setId(id);
        return customerGroup;
    }

    private static ContactResponse contactResponse(String id) {
        return new ContactResponse(
                id,
                null,
                "Jane",
                "Doe",
                null,
                "0123456789",
                null,
                "jane@example.com",
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
        );
    }
}
