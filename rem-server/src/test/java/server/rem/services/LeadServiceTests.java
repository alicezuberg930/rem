package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import server.rem.dtos.contact.ContactResponse;
import server.rem.dtos.customer.CustomerResponse;
import server.rem.dtos.lead.ConvertLeadsRequest;
import server.rem.dtos.lead.CreateLeadRequest;
import server.rem.dtos.lead.LeadResponse;
import server.rem.entities.Business;
import server.rem.entities.Contact;
import server.rem.entities.Customer;
import server.rem.entities.Lead;
import server.rem.enums.LeadSource;
import server.rem.enums.LeadStatus;
import server.rem.mappers.ContactMapper;
import server.rem.repositories.ContactRepository;
import server.rem.repositories.CustomerRepository;
import server.rem.repositories.LeadRepository;
import server.rem.utils.exceptions.ConflictException;
import server.rem.utils.exceptions.ResourceNotFoundException;

@ExtendWith(MockitoExtension.class)
class LeadServiceTests {
    @Mock
    private LeadRepository leadRepository;
    @Mock
    private ContactRepository contactRepository;
    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private ContactMapper contactMapper;
    @Mock
    private CustomerService customerService;

    private LeadService leadService;

    @BeforeEach
    void setUp() {
        leadService = new LeadService(
                leadRepository,
                contactRepository,
                customerRepository,
                contactMapper,
                customerService
        );
    }

    @Test
    void createPersistsLeadForBusinessContact() {
        Contact contact = contact("contact-1", business("business-1"));
        CreateLeadRequest request = new CreateLeadRequest(
                "contact-1",
                LeadSource.WEBSITE,
                LeadStatus.NEW
        );

        when(contactRepository.findByIdAndBusiness_Id("contact-1", "business-1"))
                .thenReturn(Optional.of(contact));
        when(customerRepository.existsByContact_Id("contact-1")).thenReturn(false);
        when(leadRepository.existsByContact_Id("contact-1")).thenReturn(false);
        when(leadRepository.save(any(Lead.class))).thenAnswer(invocation -> {
            Lead lead = invocation.getArgument(0);
            lead.setId("lead-1");
            return lead;
        });
        when(contactMapper.toContactResponse(contact)).thenReturn(contactResponse("contact-1"));

        LeadResponse response = leadService.create(request, "business-1");

        ArgumentCaptor<Lead> captor = ArgumentCaptor.forClass(Lead.class);
        verify(leadRepository).save(captor.capture());
        assertSame(contact, captor.getValue().getContact());
        assertEquals(LeadSource.WEBSITE, captor.getValue().getSource());
        assertEquals(LeadStatus.NEW, captor.getValue().getStatus());
        assertEquals("lead-1", response.getId());
    }

    @Test
    void createRejectsExistingCustomerContact() {
        Contact contact = contact("contact-1", business("business-1"));
        CreateLeadRequest request = new CreateLeadRequest("contact-1", LeadSource.WEBSITE, LeadStatus.NEW);

        when(contactRepository.findByIdAndBusiness_Id("contact-1", "business-1"))
                .thenReturn(Optional.of(contact));
        when(customerRepository.existsByContact_Id("contact-1")).thenReturn(true);

        assertThrows(ConflictException.class, () -> leadService.create(request, "business-1"));
        verify(leadRepository, never()).save(any(Lead.class));
    }

    @Test
    void updateRejectsNonConvertedStatusForCustomerContact() {
        Business business = business("business-1");
        Contact contact = contact("contact-1", business);
        Lead lead = Lead.builder()
                .contact(contact)
                .source(LeadSource.WEBSITE)
                .status(LeadStatus.CONVERTED)
                .build();
        lead.setId("lead-1");
        CreateLeadRequest request = new CreateLeadRequest(
                "contact-1",
                LeadSource.EMAIL,
                LeadStatus.NEW
        );

        when(leadRepository.findByIdAndContact_Business_Id("lead-1", "business-1"))
                .thenReturn(Optional.of(lead));
        when(contactRepository.findByIdAndBusiness_Id("contact-1", "business-1"))
                .thenReturn(Optional.of(contact));
        when(leadRepository.existsByContact_IdAndIdNot("contact-1", "lead-1")).thenReturn(false);
        when(customerRepository.existsByContact_Id("contact-1")).thenReturn(true);

        assertThrows(ConflictException.class, () -> leadService.update("lead-1", request, "business-1"));
        verify(leadRepository, never()).save(any(Lead.class));
    }

    @Test
    void deleteScopesLeadByBusiness() {
        Lead lead = Lead.builder()
                .contact(contact("contact-1", business("business-1")))
                .source(LeadSource.WEBSITE)
                .status(LeadStatus.NEW)
                .build();
        lead.setId("lead-1");

        when(leadRepository.findByIdAndContact_Business_Id("lead-1", "business-1"))
                .thenReturn(Optional.of(lead));

        leadService.delete("lead-1", "business-1");

        verify(leadRepository).delete(lead);
    }

    @Test
    void convertCreatesMissingCustomersReusesExistingCustomersAndMarksLeadsConverted() {
        Contact firstContact = contact("contact-1", business("business-1"));
        Contact secondContact = contact("contact-2", business("business-1"));
        Lead firstLead = lead("lead-1", firstContact);
        Lead secondLead = lead("lead-2", secondContact);
        Customer existingCustomer = customer("customer-2", secondContact, LocalDate.of(2026, 1, 1));

        when(leadRepository.findByIdInAndContact_Business_Id(anyCollection(), eq("business-1")))
                .thenReturn(List.of(firstLead, secondLead));
        when(customerRepository.findByContact_Id("contact-1")).thenReturn(Optional.empty());
        when(customerRepository.findByContact_Id("contact-2")).thenReturn(Optional.of(existingCustomer));
        when(customerRepository.save(any(Customer.class))).thenAnswer(invocation -> {
            Customer customer = invocation.getArgument(0);
            customer.setId("customer-1");
            return customer;
        });
        when(customerService.toResponse(any(Customer.class))).thenAnswer(invocation -> {
            Customer customer = invocation.getArgument(0);
            return new CustomerResponse(
                    customer.getId(),
                    contactResponse(customer.getContact().getId()),
                    null,
                    customer.getCustomerSince()
            );
        });

        List<CustomerResponse> responses = leadService.convert(
                new ConvertLeadsRequest(List.of("lead-1", "lead-2", "lead-1")),
                "business-1"
        );

        ArgumentCaptor<Customer> customerCaptor = ArgumentCaptor.forClass(Customer.class);
        verify(customerRepository).save(customerCaptor.capture());
        verify(leadRepository).saveAll(List.of(firstLead, secondLead));
        assertSame(firstContact, customerCaptor.getValue().getContact());
        assertEquals(LeadStatus.CONVERTED, firstLead.getStatus());
        assertEquals(LeadStatus.CONVERTED, secondLead.getStatus());
        assertEquals(List.of("customer-1", "customer-2"), responses.stream().map(CustomerResponse::getId).toList());
    }

    @Test
    void convertRejectsMissingLeadInBusinessScope() {
        when(leadRepository.findByIdInAndContact_Business_Id(anyCollection(), eq("business-1")))
                .thenReturn(List.of(lead("lead-1", contact("contact-1", business("business-1")))));

        assertThrows(
                ResourceNotFoundException.class,
                () -> leadService.convert(new ConvertLeadsRequest(List.of("lead-1", "lead-2")), "business-1")
        );
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

    private static Lead lead(String id, Contact contact) {
        Lead lead = Lead.builder()
                .contact(contact)
                .source(LeadSource.WEBSITE)
                .status(LeadStatus.NEW)
                .build();
        lead.setId(id);
        return lead;
    }

    private static Customer customer(String id, Contact contact, LocalDate customerSince) {
        Customer customer = Customer.builder()
                .contact(contact)
                .customerSince(customerSince)
                .build();
        customer.setId(id);
        return customer;
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
