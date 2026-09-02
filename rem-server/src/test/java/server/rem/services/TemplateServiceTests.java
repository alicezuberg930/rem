package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import server.rem.dtos.template.CreateTemplateRequest;
import server.rem.entities.Business;
import server.rem.entities.Template;
import server.rem.mappers.TemplateMapper;
import server.rem.repositories.BusinessRepository;
import server.rem.repositories.TemplateRepository;

@ExtendWith(MockitoExtension.class)
class TemplateServiceTests {
    @Mock
    private TemplateRepository templateRepository;
    @Mock
    private BusinessRepository businessRepository;
    @Mock
    private TemplateMapper templateMapper;

    private TemplateService templateService;

    @BeforeEach
    void setUp() {
        templateService = new TemplateService(templateRepository, businessRepository, templateMapper);
    }

    @Test
    void createsTemplateForBusiness() {
        CreateTemplateRequest request = new CreateTemplateRequest(
                "Welcome",
                "<header>",
                "<body>",
                "<footer>",
                null,
                null
        );
        Business business = new Business();
        Template template = Template.builder().business(business).name("Welcome").build();
        when(businessRepository.findById("business-id")).thenReturn(Optional.of(business));
        when(templateMapper.toEntity(request, business)).thenReturn(template);
        when(templateRepository.save(template)).thenReturn(template);

        assertSame(template, templateService.create(request, "business-id"));
    }
}
