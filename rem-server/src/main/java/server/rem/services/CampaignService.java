package server.rem.services;

import java.util.List;
import java.util.Optional;

import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import server.rem.common.messages.*;
import server.rem.dtos.CustomPageResponse;
import server.rem.dtos.campaign.*;
import server.rem.entities.*;
import server.rem.enums.*;
import server.rem.mappers.CampaignMapper;
import server.rem.repositories.*;
import server.rem.scheduler.CampaignScheduler;
import server.rem.specifications.CampaignSpecification;
import server.rem.utils.exceptions.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
public class CampaignService {
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

    @Transactional
    public CampaignResponse create(CreateCampaignRequest dto, String businessId) throws Exception {
        Business business = businessRepository.findById(businessId).orElseThrow(() -> new ResourceNotFoundException(BusinessMessages.NOT_FOUND));
        Template template = templateRepository.findById(dto.getTemplateId()).orElseThrow(() -> new ResourceNotFoundException(TemplateMessages.NOT_FOUND));
        List<Contact> contacts = contactRepository.findAllById(dto.getContactIds());
        if(contacts.size() == 0) throw new ResourceNotFoundException("No contacts found");
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
    
}