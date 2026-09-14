package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import jakarta.persistence.EntityManager;

import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import server.rem.dtos.CustomPageResponse;
import server.rem.dtos.campaign.CampaignResponse;
import server.rem.dtos.campaign.QueryCampaign;
import server.rem.entities.Business;
import server.rem.entities.Campaign;
import server.rem.entities.Contact;
import server.rem.entities.Template;
import server.rem.enums.CampaignSendType;
import server.rem.enums.CampaignStatus;
import server.rem.mappers.CampaignMapper;
import server.rem.repositories.BusinessRepository;
import server.rem.repositories.CampaignRepository;
import server.rem.repositories.ContactRepository;
import server.rem.repositories.TemplateRepository;
import server.rem.scheduler.CampaignScheduler;

@ExtendWith(MockitoExtension.class)
class CampaignServiceTests {
    @Mock
    private CampaignRepository campaignRepository;
    @Mock
    private BusinessRepository businessRepository;
    @Mock
    private TemplateRepository templateRepository;
    @Mock
    private ContactRepository contactRepository;
    @Mock
    private CampaignMapper campaignMapper;
    @Mock
    private EmailService emailService;
    @Mock
    private CampaignScheduler campaignScheduler;
    @Mock
    private EntityManager entityManager;

    private CampaignService campaignService;

    @BeforeEach
    void setUp() {
        campaignService = new CampaignService(
                campaignRepository,
                businessRepository,
                templateRepository,
                contactRepository,
                campaignMapper,
                emailService,
                campaignScheduler,
                entityManager
        );
    }

    @Test
    void sendsCampaignToEveryContactAndMarksItSent() throws Exception {
        Contact first = Contact.builder().email("first@example.com").build();
        Contact second = Contact.builder().email("second@example.com").build();
        Template template = Template.builder().header("<header>").body("<body>").footer("<footer>").build();
        Campaign campaign = Campaign.builder()
                .name("Launch")
                .template(template)
                .contacts(Set.of(first, second))
                .status(CampaignStatus.PENDING)
                .build();
        campaign.setId("campaign-id");
        when(campaignRepository.findByIdWithContactsAndTemplate("campaign-id"))
                .thenReturn(Optional.of(campaign));

        campaignService.send("campaign-id", "business-id");

        verify(emailService).sendMail(
                "business-id",
                "first@example.com",
                "Launch",
                "<header><body><footer>"
        );
        verify(emailService).sendMail(
                "business-id",
                "second@example.com",
                "Launch",
                "<header><body><footer>"
        );
        verify(campaignRepository, times(2)).save(campaign);
        assertEquals(CampaignStatus.SENT, campaign.getStatus());
    }

    @Test
    void preloadsContactsForCampaignPageBeforeMapping() {
        Campaign pageCampaign = Campaign.builder().build();
        pageCampaign.setId("campaign-id");
        Campaign campaignWithContacts = Campaign.builder().contacts(Set.of(new Contact())).build();
        campaignWithContacts.setId("campaign-id");
        CampaignResponse response = org.mockito.Mockito.mock(CampaignResponse.class);

        when(campaignRepository.findAll(
                org.mockito.ArgumentMatchers.<Specification<Campaign>>any(),
                any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(pageCampaign)));
        when(campaignRepository.findAllWithContactsByIdIn(List.of("campaign-id")))
                .thenReturn(List.of(campaignWithContacts));
        when(campaignMapper.toCampaignResponse(campaignWithContacts)).thenReturn(response);

        CustomPageResponse<CampaignResponse> result = campaignService.getAll(
                new QueryCampaign(10, 0, null),
                "business-id");

        assertSame(response, result.getContent().getFirst());
        verify(campaignRepository).findAllWithContactsByIdIn(List.of("campaign-id"));
    }

    @Test
    void writesEveryCampaignFieldToAValidWorkbook() throws Exception {
        Business business = Business.builder().name("REM").build();
        business.setId("business-1");

        Template template = Template.builder()
                .business(business)
                .name("Welcome")
                .build();
        template.setId("template-1");

        Contact contact = Contact.builder().email("jane@example.com").build();
        contact.setId("contact-1");

        Campaign campaign = Campaign.builder()
                .business(business)
                .template(template)
                .name("Launch")
                .description("Launch campaign")
                .sendType(CampaignSendType.SCHEDULED)
                .scheduleAt(Instant.parse("2026-01-03T10:15:30Z"))
                .status(CampaignStatus.PENDING)
                .contacts(Set.of(contact))
                .build();
        campaign.setId("campaign-1");
        campaign.setCreatedAt(LocalDateTime.of(2026, 1, 1, 10, 0));
        campaign.setUpdatedAt(LocalDateTime.of(2026, 1, 2, 11, 30));

        when(campaignRepository.findByBusinessId(eq("business-1"), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(campaign)));

        ByteArrayOutputStream output = new ByteArrayOutputStream();
        campaignService.writeExcel(new QueryCampaign(null, null, null), "business-1", output);

        try (XSSFWorkbook workbook = new XSSFWorkbook(new ByteArrayInputStream(output.toByteArray()))) {
            assertEquals(1, workbook.getNumberOfSheets());
            assertEquals(15, workbook.getSheetAt(0).getRow(0).getLastCellNum());
            assertEquals("Campaigns", workbook.getSheetName(0));
            assertEquals("campaign-1", workbook.getSheetAt(0).getRow(1).getCell(0).getStringCellValue());
            assertEquals("business-1", workbook.getSheetAt(0).getRow(1).getCell(3).getStringCellValue());
            assertEquals("template-1", workbook.getSheetAt(0).getRow(1).getCell(5).getStringCellValue());
            assertEquals("Launch", workbook.getSheetAt(0).getRow(1).getCell(7).getStringCellValue());
            assertEquals(1, workbook.getSheetAt(0).getRow(1).getCell(12).getNumericCellValue());
            assertEquals("contact-1", workbook.getSheetAt(0).getRow(1).getCell(13).getStringCellValue());
            assertEquals("jane@example.com", workbook.getSheetAt(0).getRow(1).getCell(14).getStringCellValue());
        }

        verify(campaignRepository).findByBusinessId(eq("business-1"), any(Pageable.class));
        verify(entityManager).clear();
    }
}
