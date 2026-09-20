package server.rem.specifications;

import org.springframework.data.jpa.domain.Specification;

import server.rem.dtos.customer.QueryCustomer;
import server.rem.entities.Customer;

public class CustomerSpecification {

    public static Specification<Customer> withFilters(QueryCustomer dto, String businessId) {
        return Specification
                .where(hasBusinessId(businessId))
                .and(hasCustomerGroup(dto.getCustomerGroupId()));
    }

    private static Specification<Customer> hasBusinessId(String businessId) {
        return (root, query, cb) -> cb.equal(root.get("contact").get("business").get("id"), businessId);
    }

    private static Specification<Customer> hasCustomerGroup(String customerGroupId) {
        return (root, query, cb) -> {
            if (customerGroupId == null) {
                return null;
            }
            if ("none".equals(customerGroupId)) {
                return cb.isNull(root.get("customerGroup"));
            }
            return cb.equal(root.get("customerGroup").get("id"), customerGroupId);
        };
    }
}
