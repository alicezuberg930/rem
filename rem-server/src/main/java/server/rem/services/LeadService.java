package server.rem.services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import server.rem.dtos.CustomPageResponse;
import server.rem.dtos.customer.CustomerResponse;
import server.rem.dtos.lead.ConvertLeadsRequest;
import server.rem.dtos.lead.CreateLeadRequest;
import server.rem.dtos.lead.LeadResponse;
import server.rem.dtos.lead.QueryLead;
import server.rem.entities.Contact;
import server.rem.entities.Customer;
import server.rem.entities.Lead;
import server.rem.enums.LeadStatus;
import server.rem.mappers.ContactMapper;
import server.rem.repositories.ContactRepository;
import server.rem.repositories.CustomerRepository;
import server.rem.repositories.LeadRepository;
import server.rem.specifications.LeadSpecification;
import server.rem.utils.exceptions.ConflictException;
import server.rem.utils.exceptions.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
public class LeadService {
    private final LeadRepository leadRepository;
    private final ContactRepository contactRepository;
    private final CustomerRepository customerRepository;
    private final ContactMapper contactMapper;
    private final CustomerService customerService;

    @Transactional(readOnly = true)
    public CustomPageResponse<LeadResponse> getAll(QueryLead dto, String businessId) {
        Pageable pageable = PageRequest.of(dto.getPage(), dto.getPageSize());
        Specification<Lead> spec = LeadSpecification.withFilters(dto, businessId);
        Page<LeadResponse> result = leadRepository.findAll(spec, pageable).map(this::toResponse);
        return new CustomPageResponse<>(result);
    }

    @Transactional(readOnly = true)
    public LeadResponse getOne(String id, String businessId) {
        return toResponse(getById(id, businessId));
    }

    @Transactional
    public LeadResponse create(CreateLeadRequest dto, String businessId) {
        Contact contact = getContact(dto.getContactId(), businessId);
        if (customerRepository.existsByContact_Id(contact.getId())) {
            throw new ConflictException("Contact is already a customer");
        }
        if (leadRepository.existsByContact_Id(contact.getId())) {
            throw new ConflictException("Contact is already a lead");
        }
        Lead lead = Lead.builder()
                .contact(contact)
                .source(dto.getSource())
                .status(dto.getStatus())
                .build();
        return toResponse(leadRepository.save(lead));
    }

    @Transactional
    public LeadResponse update(String id, CreateLeadRequest dto, String businessId) {
        Lead lead = getById(id, businessId);
        Contact contact = getContact(dto.getContactId(), businessId);
        if (leadRepository.existsByContact_IdAndIdNot(contact.getId(), id)) {
            throw new ConflictException("Contact is already a lead");
        }
        if (customerRepository.existsByContact_Id(contact.getId()) && dto.getStatus() != LeadStatus.CONVERTED) {
            throw new ConflictException("Contact is already a customer");
        }
        lead.setContact(contact);
        lead.setSource(dto.getSource());
        lead.setStatus(dto.getStatus());
        return toResponse(leadRepository.save(lead));
    }

    @Transactional
    public void delete(String id, String businessId) {
        leadRepository.delete(getById(id, businessId));
    }

    @Transactional
    public List<CustomerResponse> convert(ConvertLeadsRequest dto, String businessId) {
        LinkedHashSet<String> leadIds = new LinkedHashSet<>(dto.getLeadIds());
        if (leadIds.isEmpty()) {
            throw new IllegalArgumentException("Lead IDs are required");
        }
        List<Lead> leads = leadRepository.findByIdInAndContact_Business_Id(leadIds, businessId);
        if (leads.size() != leadIds.size()) {
            throw new ResourceNotFoundException("Lead not found");
        }

        Map<String, Lead> leadsById = leads.stream().collect(Collectors.toMap(Lead::getId, Function.identity()));
        List<CustomerResponse> customers = new ArrayList<>(leadIds.size());
        for (String leadId : leadIds) {
            Lead lead = leadsById.get(leadId);
            Customer customer = customerRepository.findByContact_Id(lead.getContact().getId())
                    .orElseGet(() -> customerRepository.save(Customer.builder()
                            .contact(lead.getContact())
                            .customerSince(LocalDate.now())
                            .build()));
            lead.setStatus(LeadStatus.CONVERTED);
            customers.add(customerService.toResponse(customer));
        }
        leadRepository.saveAll(leads);
        return customers;
    }

    private LeadResponse toResponse(Lead lead) {
        return new LeadResponse(
                lead.getId(),
                contactMapper.toContactResponse(lead.getContact()),
                lead.getSource(),
                lead.getStatus()
        );
    }

    private Lead getById(String id, String businessId) {
        return leadRepository.findByIdAndContact_Business_Id(id, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found"));
    }

    private Contact getContact(String contactId, String businessId) {
        return contactRepository.findByIdAndBusiness_Id(contactId, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));
    }
}
