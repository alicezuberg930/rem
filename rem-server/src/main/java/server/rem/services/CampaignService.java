package server.rem.services;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.apache.coyote.BadRequestException;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import server.rem.dtos.CustomPageResponse;
import server.rem.dtos.campaign.CampaignResponse;
import server.rem.dtos.campaign.CreateCampaignRequest;
import server.rem.dtos.campaign.QueryCampaign;
import server.rem.dtos.campaign.UpdateCampaignRequest;
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
import server.rem.specifications.CampaignSpecification;
import server.rem.utils.ExportExcel;
import server.rem.utils.exceptions.ResourceNotFoundException;
import server.rem.utils.messages.BusinessMessages;
import server.rem.utils.messages.CampaignMessages;
import server.rem.utils.messages.TemplateMessages;

@Service
@RequiredArgsConstructor
public class CampaignService {
    private static final int EXPORT_PAGE_SIZE = 1_000;
    private static final int DEFAULT_COLUMN_WIDTH = 5_000;
    private static final int DESCRIPTION_COLUMN_INDEX = 8;
    private static final int CONTACT_IDS_COLUMN_INDEX = 13;
    private static final int CONTACT_EMAILS_COLUMN_INDEX = 14;
    private static final int LONG_COLUMN_WIDTH = 12_000;
    private static final String[] EXPORT_HEADERS = {
            "ID",
            "Created At",
            "Updated At",
            "Business ID",
            "Business Name",
            "Template ID",
            "Template Name",
            "Name",
            "Description",
            "Send Type",
            "Schedule At",
            "Status",
            "Contact Count",
            "Contact IDs",
            "Contact Emails"
    };

    // repositories
    private final CampaignRepository campaignRepository;
    private final BusinessRepository businessRepository;
    private final TemplateRepository templateRepository;
    private final ContactRepository contactRepository;
    // mappers
    private final CampaignMapper campaignMapper;
    // services
    private final EmailService emailService;
    // schedulers & jobs
    private final CampaignScheduler campaignScheduler;
    private final EntityManager entityManager;

    @Transactional
    public CampaignResponse create(CreateCampaignRequest dto, String businessId) throws Exception {
        Business business = businessRepository.findById(businessId).orElseThrow(() -> new ResourceNotFoundException(BusinessMessages.NOT_FOUND));
        Template template = templateRepository.findById(dto.getTemplateId()).orElseThrow(() -> new ResourceNotFoundException(TemplateMessages.NOT_FOUND));
        List<Contact> contacts = contactRepository.findAllById(dto.getContactIds());
        if(contacts.isEmpty()) throw new ResourceNotFoundException("No contacts found");
        Campaign campaign = campaignRepository.save(campaignMapper.toEntity(dto, business, template, contacts));
        if(dto.getSendType().equals(CampaignSendType.SCHEDULED) && dto.getScheduleAt() == null) throw new BadRequestException(CampaignMessages.INVALID_DATE);
        if(dto.getSendType().equals(CampaignSendType.IMMEDIATE)){
            send(campaign.getId(), businessId);
        } else {
            // schedule to quartz
            campaignScheduler.scheduleCampaign(campaign);
        }
        return campaignMapper.toCampaignResponse(campaign);
    }

    @Transactional
    public CampaignResponse update(UpdateCampaignRequest dto, String businessId, String id) throws Exception {
        Campaign campaign = campaignRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(CampaignMessages.NOT_FOUND));
        Optional<Template> template = templateRepository.findById(dto.getTemplateId());
        List<Contact> contacts = contactRepository.findAllById(dto.getContactIds());
        if(dto.getSendType() == CampaignSendType.IMMEDIATE) {
            campaign.setScheduleAt(null);
            send(campaign.getId(), businessId);
        }
        if (dto.getSendType() == CampaignSendType.SCHEDULED && !campaign.getScheduleAt().equals(dto.getScheduleAt())) {
            campaign.setStatus(CampaignStatus.PENDING);
        }
        campaignMapper.updateEntity(dto, template.isPresent()? template.get() : null, contacts, campaign);
        Campaign updatedCampaign = campaignRepository.save(campaign);
        if(updatedCampaign.getStatus().equals(CampaignStatus.PENDING)) campaignScheduler.rescheduleCampaign(updatedCampaign);
        return campaignMapper.toCampaignResponse(updatedCampaign);
    }

    public CustomPageResponse<CampaignResponse> getAll(QueryCampaign dto, String businessId) {
        Pageable pageable = PageRequest.of(dto.getPage(), dto.getPageSize());
        Specification<Campaign> spec = CampaignSpecification.withFilters(dto, businessId);
        Page<CampaignResponse> result = campaignRepository.findAll(spec, pageable).map(campaignMapper::toCampaignResponse);
        return new CustomPageResponse<CampaignResponse>(result);
    }

    @Transactional(readOnly = true)
    public void writeExcel(QueryCampaign query, String businessId, OutputStream outputStream) throws IOException {
        SXSSFWorkbook workbook = ExportExcel.createWorkbook();
        try (workbook) {
            CellStyle headerStyle = ExportExcel.createHeaderStyle(workbook);
            int sheetNumber = 1;
            SXSSFSheet sheet = createExportSheet(workbook, sheetNumber, headerStyle);
            int rowIndex = 1;
            int pageNumber = 0;
            Slice<Campaign> page;

            do {
                page = campaignRepository.findByBusinessId(
                        businessId,
                        PageRequest.of(pageNumber, EXPORT_PAGE_SIZE, Sort.by(Sort.Direction.ASC, "id"))
                );
                for (Campaign campaign : page.getContent()) {
                    if (rowIndex == ExportExcel.MAX_ROWS_PER_SHEET) {
                        sheet = createExportSheet(workbook, ++sheetNumber, headerStyle);
                        rowIndex = 1;
                    }
                    writeCampaign(sheet.createRow(rowIndex++), campaign);
                }
                entityManager.clear();
                pageNumber++;
            } while (page.hasNext());

            ExportExcel.write(workbook, outputStream);
        }
    }

    @Transactional
    public void send(String campaignId, String businessId) throws Exception{
        Campaign campaign = campaignRepository.findByIdWithContactsAndTemplate(campaignId).orElseThrow(() -> new ResourceNotFoundException(CampaignMessages.NOT_FOUND));
        try {
            List<Contact> contacts = campaign.getContacts().stream().toList();
            String html = campaign.getTemplate().getHeader() + campaign.getTemplate().getBody() + campaign.getTemplate().getFooter();
            campaign.setStatus(CampaignStatus.PROCESSING);
            campaignRepository.save(campaign);
            for (Contact cc : contacts) {
                emailService.sendMail(businessId, cc.getEmail(), campaign.getName(), html);
            }
            campaign.setStatus(CampaignStatus.SENT);
        } catch (Exception e) {
            System.out.print(e.getMessage());
            campaign.setStatus(CampaignStatus.FAILED);
        } finally {
            campaignRepository.save(campaign);
        }
    }

    private SXSSFSheet createExportSheet(SXSSFWorkbook workbook, int sheetNumber, CellStyle headerStyle) {
        String name = sheetNumber == 1 ? "Campaigns" : "Campaigns " + sheetNumber;
        return ExportExcel.createSheet(
                workbook,
                name,
                EXPORT_HEADERS,
                headerStyle,
                columnIndex -> switch (columnIndex) {
                    case DESCRIPTION_COLUMN_INDEX, CONTACT_IDS_COLUMN_INDEX, CONTACT_EMAILS_COLUMN_INDEX -> LONG_COLUMN_WIDTH;
                    default -> DEFAULT_COLUMN_WIDTH;
                }
        );
    }

    private void writeCampaign(Row row, Campaign campaign) {
        Business business = campaign.getBusiness();
        Template template = campaign.getTemplate();
        Set<Contact> contacts = campaign.getContacts();
        int columnIndex = 0;

        ExportExcel.setCellValue(row, columnIndex++, campaign.getId());
        ExportExcel.setCellValue(row, columnIndex++, campaign.getCreatedAt());
        ExportExcel.setCellValue(row, columnIndex++, campaign.getUpdatedAt());
        ExportExcel.setCellValue(row, columnIndex++, business == null ? null : business.getId());
        ExportExcel.setCellValue(row, columnIndex++, business == null ? null : business.getName());
        ExportExcel.setCellValue(row, columnIndex++, template == null ? null : template.getId());
        ExportExcel.setCellValue(row, columnIndex++, template == null ? null : template.getName());
        ExportExcel.setCellValue(row, columnIndex++, campaign.getName());
        ExportExcel.setCellValue(row, columnIndex++, campaign.getDescription());
        ExportExcel.setCellValue(row, columnIndex++, campaign.getSendType());
        ExportExcel.setCellValue(row, columnIndex++, campaign.getScheduleAt());
        ExportExcel.setCellValue(row, columnIndex++, campaign.getStatus());
        ExportExcel.setCellValue(row, columnIndex++, contacts == null ? 0 : contacts.size());
        ExportExcel.setCellValue(row, columnIndex++, joinContacts(contacts, Contact::getId));
        ExportExcel.setCellValue(row, columnIndex, joinContacts(contacts, Contact::getEmail));
    }

    private String joinContacts(Set<Contact> contacts, Function<Contact, String> mapper) {
        if (contacts == null || contacts.isEmpty()) return null;
        return contacts.stream()
                .map(mapper)
                .filter(value -> value != null && !value.isBlank())
                .sorted()
                .collect(Collectors.joining("; "));
    }
    
}
