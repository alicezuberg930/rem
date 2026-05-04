package server.rem.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import server.rem.common.messages.*;
import server.rem.dtos.CustomPageResponse;
import server.rem.dtos.template.*;
import server.rem.entities.*;
import server.rem.mappers.TemplateMapper;
import server.rem.repositories.*;
import server.rem.specifications.TemplateSpecification;
import server.rem.utils.exceptions.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
public class TemplateService {
    // repoistories
    private final TemplateRepository templateRepository;
    private final BusinessRepository businessRepository;
    // mappers
    private final TemplateMapper templateMapper;

    public Template createTemplate(CreateTemplateRequest dto, String businessId) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException(BusinessMessages.NOT_FOUND));
        Template template = templateMapper.toEntity(dto, business);
        return templateRepository.save(template);
    }

    public Template updateTemplate(UpdateTemplateRequest dto, String id, String businessId) {
        businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException(BusinessMessages.NOT_FOUND));
        Template template = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(TemplateMessages.NOT_FOUND));
        templateMapper.updateEntity(dto, template);
        return templateRepository.save(template);
    }

    public Template deleteTemplate(String id, String businessId) {
        businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException(BusinessMessages.NOT_FOUND));
        Template template = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(TemplateMessages.NOT_FOUND));
        templateRepository.delete(template);
        return template;
    }

    public CustomPageResponse<TemplateResponse> getAll(QueryTemplate dto, String businessId) {
        Pageable pageable = PageRequest.of(dto.getPage(), dto.getPageSize());
        Specification<Template> spec = TemplateSpecification.withFilters(dto, businessId);
        Page<TemplateResponse> result = templateRepository.findAll(spec, pageable).map(templateMapper::toTemplateResponse);
        return new CustomPageResponse<TemplateResponse>(result);
    }
}