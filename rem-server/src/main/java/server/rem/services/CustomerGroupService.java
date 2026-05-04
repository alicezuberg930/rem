package server.rem.services;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import server.rem.common.messages.*;
import server.rem.dtos.customer_group.*;
import server.rem.entities.*;
import server.rem.mappers.CustomerGroupMapper;
import server.rem.repositories.*;
import server.rem.utils.exceptions.ResourceNotFoundException;

import java.util.List;

@Service
@AllArgsConstructor
public class CustomerGroupService {
    private final CustomerGroupRepository customerGroupRepository;
    private final BusinessRepository businessRepository;
    private final CustomerGroupMapper customerGroupMapper;

    public List<CustomerGroup> getAll(QueryCustomerGroup dto, String businessId) {
        Business business = businessRepository.findById(businessId).orElseThrow(() -> new ResourceNotFoundException(BusinessMessages.NOT_FOUND));
        return customerGroupRepository.findByBusiness(business);
    }

    public CustomerGroup getById(String id) {
        return customerGroupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer group not found"));
    }

    public CustomerGroup create(CreateCustomerGroupRequest dto) {
        Business business = businessRepository.findById(dto.getBusinessId())
                .orElseThrow(() -> new RuntimeException("Business not found"));
        // if (customerGroupRepository.existsByNameAndBusinessId(dto.getName(), dto.getBusinessId())) {
        //     throw new RuntimeException("Group with name '" + dto.getName() + "' already exists in this business");
        // }
        CustomerGroup group = customerGroupMapper.toEntity(dto, business);
        return customerGroupRepository.save(group);
    }

    public CustomerGroup update(String id, CreateCustomerGroupRequest dto) {
        CustomerGroup group = getById(id);
        customerGroupMapper.updateEntity(dto, group);
        return customerGroupRepository.save(group);
    }

    public void delete(String id) {
        customerGroupRepository.delete(getById(id));
    }
}