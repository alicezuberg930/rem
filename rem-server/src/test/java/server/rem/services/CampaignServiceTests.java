package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import server.rem.entities.Campaign;
import server.rem.entities.Contact;
import server.rem.entities.Template;
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
                campaignScheduler
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
}
