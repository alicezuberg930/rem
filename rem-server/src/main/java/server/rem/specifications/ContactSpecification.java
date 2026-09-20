package server.rem.specifications;

import org.springframework.data.jpa.domain.Specification;

import server.rem.dtos.contact.QueryContact;
import server.rem.entities.Contact;
import server.rem.enums.ContactType;

public class ContactSpecification {

    public static Specification<Contact> withFilters(QueryContact dto, String businessId) {
        return Specification
                .where(hasBusinessId(businessId))
                .and(hasType(dto.getType()));
    }

    private static Specification<Contact> hasBusinessId(String businessId) {
        return (root, query, cb) -> cb.equal(root.get("business").get("id"), businessId);
    }

    private static Specification<Contact> hasType(ContactType type) {
        return (root, query, cb) -> type == null ? null : cb.equal(root.get("type"), type);
    }

}
