package server.rem.specifications;

import org.springframework.data.jpa.domain.Specification;

import server.rem.dtos.lead.QueryLead;
import server.rem.entities.Lead;
import server.rem.enums.LeadSource;
import server.rem.enums.LeadStatus;

public class LeadSpecification {

    public static Specification<Lead> withFilters(QueryLead dto, String businessId) {
        return Specification
                .where(hasBusinessId(businessId))
                .and(hasSource(dto.getSource()))
                .and(hasStatus(dto.getStatus()));
    }

    private static Specification<Lead> hasBusinessId(String businessId) {
        return (root, query, cb) -> cb.equal(root.get("contact").get("business").get("id"), businessId);
    }

    private static Specification<Lead> hasSource(LeadSource source) {
        return (root, query, cb) -> source == null ? null : cb.equal(root.get("source"), source);
    }

    private static Specification<Lead> hasStatus(LeadStatus status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }
}
