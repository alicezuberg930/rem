package server.rem.services;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import server.rem.dtos.CustomPageResponse;
import server.rem.dtos.customer.CreateCustomerRequest;
import server.rem.dtos.customer.CustomerGroupResponse;
import server.rem.dtos.customer.CustomerResponse;
import server.rem.dtos.customer.QueryCustomer;
import server.rem.entities.Contact;
import server.rem.entities.Customer;
import server.rem.entities.CustomerGroup;
import server.rem.mappers.ContactMapper;
import server.rem.repositories.ContactRepository;
import server.rem.repositories.CustomerGroupRepository;
import server.rem.repositories.CustomerRepository;
import server.rem.specifications.CustomerSpecification;
import server.rem.utils.exceptions.ConflictException;
import server.rem.utils.exceptions.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository customerRepository;
    private final ContactRepository contactRepository;
    private final CustomerGroupRepository customerGroupRepository;
    private final ContactMapper contactMapper;

    @Transactional(readOnly = true)
    public CustomPageResponse<CustomerResponse> getAll(QueryCustomer dto, String businessId) {
        Pageable pageable = PageRequest.of(dto.getPage(), dto.getPageSize());
        Specification<Customer> spec = CustomerSpecification.withFilters(dto, businessId);
        Page<CustomerResponse> result = customerRepository.findAll(spec, pageable).map(this::toResponse);
        return new CustomPageResponse<>(result);
    }

    @Transactional(readOnly = true)
    public CustomerResponse getOne(String id, String businessId) {
        return toResponse(getById(id, businessId));
    }

    @Transactional
    public CustomerResponse create(CreateCustomerRequest dto, String businessId) {
        Contact contact = getContact(dto.getContactId(), businessId);
        if (customerRepository.existsByContact_Id(contact.getId())) {
            throw new ConflictException("Contact is already a customer");
        }
        Customer customer = Customer.builder()
                .contact(contact)
                .customerGroup(resolveCustomerGroup(dto.getCustomerGroupId(), businessId))
                .customerSince(dto.getCustomerSince() == null ? LocalDate.now() : dto.getCustomerSince())
                .build();
        return toResponse(customerRepository.save(customer));
    }

    @Transactional
    public CustomerResponse update(String id, CreateCustomerRequest dto, String businessId) {
        Customer customer = getById(id, businessId);
        Contact contact = getContact(dto.getContactId(), businessId);
        if (customerRepository.existsByContact_IdAndIdNot(contact.getId(), id)) {
            throw new ConflictException("Contact is already a customer");
        }
        customer.setContact(contact);
        customer.setCustomerGroup(resolveCustomerGroup(dto.getCustomerGroupId(), businessId));
        customer.setCustomerSince(dto.getCustomerSince() == null ? customer.getCustomerSince() : dto.getCustomerSince());
        return toResponse(customerRepository.save(customer));
    }

    @Transactional
    public void delete(String id, String businessId) {
        customerRepository.delete(getById(id, businessId));
    }

    CustomerResponse toResponse(Customer customer) {
        return new CustomerResponse(
                customer.getId(),
                contactMapper.toContactResponse(customer.getContact()),
                toCustomerGroupResponse(customer.getCustomerGroup()),
                customer.getCustomerSince()
        );
    }

    private CustomerGroupResponse toCustomerGroupResponse(CustomerGroup customerGroup) {
        if (customerGroup == null) return null;
        return new CustomerGroupResponse(customerGroup.getId(), customerGroup.getName(), customerGroup.getPercentage());
    }

    private Customer getById(String id, String businessId) {
        return customerRepository.findByIdAndContact_Business_Id(id, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
    }

    private Contact getContact(String contactId, String businessId) {
        return contactRepository.findByIdAndBusiness_Id(contactId, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));
    }

    private CustomerGroup resolveCustomerGroup(String customerGroupId, String businessId) {
        if (customerGroupId == null) return null;
        CustomerGroup customerGroup = customerGroupRepository.findById(customerGroupId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer group not found"));
        if (!customerGroup.getBusiness().getId().equals(businessId)) {
            throw new ResourceNotFoundException("Customer group not found");
        }
        return customerGroup;
    }
}
