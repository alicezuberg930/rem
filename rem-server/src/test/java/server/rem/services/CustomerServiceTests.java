package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityManager;

import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import server.rem.dtos.contact.ContactResponse;
import server.rem.dtos.customer.CreateCustomerRequest;
import server.rem.dtos.customer.CustomerResponse;
import server.rem.dtos.customer.QueryCustomer;
import server.rem.entities.Business;
import server.rem.entities.Contact;
import server.rem.entities.ContactTag;
import server.rem.entities.Customer;
import server.rem.entities.CustomerGroup;
import server.rem.enums.Color;
import server.rem.enums.ContactType;
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
    @Mock
    private EntityManager entityManager;

    private CustomerService customerService;

    @BeforeEach
    void setUp() {
        customerService = new CustomerService(
                customerRepository,
                contactRepository,
                customerGroupRepository,
                contactMapper,
                entityManager
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

        when(contactRepository.findByIdAndBusinessId("contact-1", "business-1"))
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

        when(contactRepository.findByIdAndBusinessId("contact-1", "business-1"))
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
        when(contactRepository.findByIdAndBusinessId("contact-1", "business-1"))
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
        when(contactRepository.findByIdAndBusinessId("contact-1", "business-1"))
                .thenReturn(Optional.of(contact));
        when(customerRepository.existsByContact_IdAndIdNot("contact-1", "customer-1")).thenReturn(false);
        when(customerGroupRepository.findById("group-2"))
                .thenReturn(Optional.of(customerGroup("group-2", business("business-2"))));

        assertThrows(ResourceNotFoundException.class, () -> customerService.update("customer-1", request, "business-1"));
        verify(customerRepository, never()).save(any(Customer.class));
    }

    @Test
    void writesEveryCustomerFieldToAValidWorkbook() throws Exception {
        Business business = business("business-1");
        ContactTag tag = ContactTag.builder()
                .business(business)
                .name("Returning")
                .color(Color.BLUE)
                .isActive(true)
                .build();
        tag.setId("tag-1");
        Contact contact = fullContact("contact-1", business, tag);
        CustomerGroup customerGroup = customerGroup("group-1", business);
        Customer customer = Customer.builder()
                .contact(contact)
                .customerGroup(customerGroup)
                .customerSince(LocalDate.of(2026, 1, 10))
                .build();
        customer.setId("customer-1");
        customer.setCreatedAt(LocalDateTime.of(2026, 1, 1, 10, 0));
        customer.setUpdatedAt(LocalDateTime.of(2026, 1, 2, 11, 30));

        when(customerRepository.findAllForExport(eq("business-1"), eq("group-1"), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(customer)));

        ByteArrayOutputStream output = new ByteArrayOutputStream();
        customerService.writeExcel(new QueryCustomer(null, null, "group-1"), "business-1", output);

        try (XSSFWorkbook workbook = new XSSFWorkbook(new ByteArrayInputStream(output.toByteArray()))) {
            assertEquals(1, workbook.getNumberOfSheets());
            assertEquals(37, workbook.getSheetAt(0).getRow(0).getLastCellNum());
            assertEquals("Customers", workbook.getSheetName(0));
            assertEquals("customer-1", workbook.getSheetAt(0).getRow(1).getCell(0).getStringCellValue());
            assertEquals("contact-1", workbook.getSheetAt(0).getRow(1).getCell(3).getStringCellValue());
            assertEquals("group-1", workbook.getSheetAt(0).getRow(1).getCell(4).getStringCellValue());
            assertEquals("business-1", workbook.getSheetAt(0).getRow(1).getCell(8).getStringCellValue());
            assertEquals("Returning", workbook.getSheetAt(0).getRow(1).getCell(11).getStringCellValue());
            assertEquals("Jane", workbook.getSheetAt(0).getRow(1).getCell(15).getStringCellValue());
            assertEquals("100000", workbook.getSheetAt(0).getRow(1).getCell(36).getStringCellValue());
        }

        verify(customerRepository).findAllForExport(eq("business-1"), eq("group-1"), any(Pageable.class));
        verify(entityManager).clear();
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

    private static Contact fullContact(String id, Business business, ContactTag tag) {
        Contact contact = Contact.builder()
                .business(business)
                .tag(tag)
                .type(ContactType.PERSONAL)
                .firstName("Jane")
                .lastName("Doe")
                .surname("Nguyen")
                .phone("0123456789")
                .mobilePhone("0987654321")
                .email("jane@example.com")
                .birthday("1990-01-02")
                .occupation("Engineer")
                .taxCode("TAX-1")
                .website("https://example.com")
                .facebook("jane.doe")
                .instagram("jane")
                .zalo("0123456789")
                .identityCard("ID-1")
                .identityIssuedOn(LocalDate.of(2020, 3, 4))
                .identityIssuedAt("Hanoi")
                .insuranceNumber("INS-1")
                .note("Prefers email")
                .address1("Address 1")
                .address2("Address 2")
                .country("Vietnam")
                .zipCode("100000")
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
                null,
                null
        );
    }
}
