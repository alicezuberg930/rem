package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.EntityManager;

import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import server.rem.dtos.contact.QueryContact;
import server.rem.entities.Business;
import server.rem.entities.Contact;
import server.rem.entities.ContactTag;
import server.rem.entities.CustomerGroup;
import server.rem.enums.Color;
import server.rem.enums.ContactType;
import server.rem.mappers.ContactMapper;
import server.rem.repositories.BusinessRepository;
import server.rem.repositories.ContactRepository;
import server.rem.repositories.ContactTagRepository;
import server.rem.repositories.CustomerGroupRepository;

@ExtendWith(MockitoExtension.class)
class ContactServiceExportTests {
    @Mock
    private ContactRepository contactRepository;

    @Mock
    private BusinessRepository businessRepository;

    @Mock
    private ContactTagRepository contactTagRepository;

    @Mock
    private CustomerGroupRepository customerGroupRepository;

    @Mock
    private ContactMapper contactMapper;

    @Mock
    private EntityManager entityManager;

    private ContactService contactService;

    @BeforeEach
    void setUp() {
        contactService = new ContactService(
                contactRepository,
                businessRepository,
                contactTagRepository,
                customerGroupRepository,
                contactMapper,
                entityManager
        );
    }

    @Test
    void writesEveryCustomerFieldToAValidWorkbook() throws Exception {
        Business business = Business.builder().name("REM").build();
        business.setId("business-1");

        CustomerGroup customerGroup = CustomerGroup.builder()
                .name("VIP")
                .percentage(15.5)
                .business(business)
                .build();
        customerGroup.setId("group-1");

        ContactTag tag = ContactTag.builder()
                .name("Returning")
                .business(business)
                .color(Color.BLUE)
                .isActive(true)
                .build();
        tag.setId("tag-1");

        Contact contact = Contact.builder()
                .business(business)
                .customerGroup(customerGroup)
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
        contact.setId("contact-1");
        contact.setCreatedAt(LocalDateTime.of(2026, 1, 1, 10, 0));
        contact.setUpdatedAt(LocalDateTime.of(2026, 2, 2, 11, 30));

        when(contactRepository.findAllForExport(
                eq("business-1"),
                isNull(),
                isNull(),
                any(Pageable.class)
        ))
                .thenReturn(new PageImpl<>(List.of(contact)));

        ByteArrayOutputStream output = new ByteArrayOutputStream();
        contactService.writeExcel(new QueryContact(null, null, null, null), "business-1", output);

        try (XSSFWorkbook workbook = new XSSFWorkbook(new ByteArrayInputStream(output.toByteArray()))) {
            assertEquals(1, workbook.getNumberOfSheets());
            assertEquals(35, workbook.getSheetAt(0).getRow(0).getLastCellNum());
            assertEquals("ID", workbook.getSheetAt(0).getRow(0).getCell(0).getStringCellValue());
            assertEquals("contact-1", workbook.getSheetAt(0).getRow(1).getCell(0).getStringCellValue());
            assertEquals("REM", workbook.getSheetAt(0).getRow(1).getCell(4).getStringCellValue());
            assertEquals("VIP", workbook.getSheetAt(0).getRow(1).getCell(6).getStringCellValue());
            assertEquals("Returning", workbook.getSheetAt(0).getRow(1).getCell(9).getStringCellValue());
            assertEquals("Jane", workbook.getSheetAt(0).getRow(1).getCell(13).getStringCellValue());
            assertEquals("100000", workbook.getSheetAt(0).getRow(1).getCell(34).getStringCellValue());
        }

        verify(contactRepository).findAllForExport(
                eq("business-1"),
                isNull(),
                isNull(),
                any(Pageable.class)
        );
        verify(entityManager).clear();
    }
}
