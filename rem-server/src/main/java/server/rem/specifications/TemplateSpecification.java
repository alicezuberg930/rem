package server.rem.specifications;

import org.springframework.data.jpa.domain.Specification;

import server.rem.dtos.template.QueryTemplate;
import server.rem.entities.Template;

public class TemplateSpecification {
    public static Specification<Template> withFilters(QueryTemplate dto, String businessId) {
        return Specification
                .where(hasBusinessId(businessId))
                .and(hasContactPhone(dto.getContactPhone()));
    }

    private static Specification<Template> hasBusinessId(String businessId) {
        return (root, query, cb) -> cb.equal(root.get("business").get("id"), businessId);
    }

    private static Specification<Template> hasContactPhone(String contactPhone) {
        return (root, query, cb) -> contactPhone == null ? null : cb.equal(root.get("contactPhone"), contactPhone);
    }

}
