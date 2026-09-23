package server.rem.specifications;

import org.springframework.data.jpa.domain.Specification;

import server.rem.dtos.variant.QueryVariant;
import server.rem.entities.Variant;

public class VariantSpecification {
    private VariantSpecification() {
    }

    public static Specification<Variant> withFilters(QueryVariant dto, String businessId) {
        return Specification
                .where(hasBusinessId(businessId))
                .and(nameContains(dto.getName()));
    }

    private static Specification<Variant> hasBusinessId(String businessId) {
        return (root, query, cb) -> cb.equal(root.get("business").get("id"), businessId);
    }

    private static Specification<Variant> nameContains(String name) {
        return (root, query, cb) -> {
            if (name == null || name.isBlank()) {
                return null;
            }
            return cb.like(cb.lower(root.get("name")), "%" + name.trim().toLowerCase() + "%");
        };
    }
}
