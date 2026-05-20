package server.rem.services;

import lombok.AllArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import server.rem.dtos.CustomPageResponse;
import server.rem.dtos.contact.ContactResponse;
import server.rem.dtos.contact.CreateContactRequest;
import server.rem.dtos.contact.QueryContact;
import server.rem.entities.Business;
import server.rem.entities.Contact;
import server.rem.entities.ContactTag;
import server.rem.entities.CustomerGroup;
import server.rem.mappers.ContactMapper;
import server.rem.repositories.BusinessRepository;
import server.rem.repositories.ContactRepository;
import server.rem.repositories.ContactTagRepository;
import server.rem.repositories.CustomerGroupRepository;
import server.rem.specifications.ContactSpecification;
import server.rem.utils.exceptions.ResourceNotFoundException;

@Service
@AllArgsConstructor
public class ContactService {
    private final ContactRepository contactRepository;
    private final BusinessRepository businessRepository;
    private final ContactTagRepository contactTagRepository;
    private final CustomerGroupRepository customerGroupRepository;
    private final ContactMapper contactMapper;

    public CustomPageResponse<ContactResponse> getAll(QueryContact dto, String businessId) {
        Pageable pageable = PageRequest.of(dto.getPage(), dto.getPageSize());
        Specification<Contact> spec = ContactSpecification.withFilters(dto, businessId);
        Page<ContactResponse> result = contactRepository.findAll(spec, pageable).map(contactMapper::toContactResponse);
        return new CustomPageResponse<ContactResponse>(result);
    }

    public Contact getOne(String id) {
        return contactRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
    }

    public Contact create(CreateContactRequest dto) {
        Business business = businessRepository.findById(dto.getBusinessId())
                .orElseThrow(() -> new RuntimeException("Business not found"));
        ContactTag tag = contactTagRepository.findById(dto.getTagId())
                .orElseThrow(() -> new RuntimeException("Tag not found"));
        CustomerGroup customerGroup = resolveCustomerGroup(dto.getCustomerGroupId());

        if (contactRepository.existsByEmailAndBusinessId(dto.getEmail(), dto.getBusinessId())) {
            throw new RuntimeException("Contact with email '" + dto.getEmail() + "' already exists in this business");
        }

        Contact contact = contactMapper.toEntity(dto, business, tag, customerGroup);
        return contactRepository.save(contact);
    }

    public Contact update(String id, CreateContactRequest dto) {
        Contact contact = getOne(id);
        ContactTag tag = contactTagRepository.findById(dto.getTagId())
                .orElseThrow(() -> new RuntimeException("Tag not found"));
        CustomerGroup customerGroup = resolveCustomerGroup(dto.getCustomerGroupId());

        contactMapper.updateEntity(dto, tag, customerGroup, contact);
        return contactRepository.save(contact);
    }

    public void delete(String id) {
        contactRepository.delete(getOne(id));
    }

    private CustomerGroup resolveCustomerGroup(String customerGroupId) {
        if (customerGroupId == null) return null;
        return customerGroupRepository.findById(customerGroupId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer group not found"));
    }
}
