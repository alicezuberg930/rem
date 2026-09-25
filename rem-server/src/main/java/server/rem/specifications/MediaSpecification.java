package server.rem.specifications;

import org.springframework.data.jpa.domain.Specification;

import server.rem.entities.Media;
import server.rem.enums.MediaStatus;

public final class MediaSpecification {

    private MediaSpecification() {
    }

    public static Specification<Media> withFilters(MediaStatus status, String businessId) {
        return Specification
                .where(hasBusinessId(businessId))
                .and(hasStatus(status));
    }

    private static Specification<Media> hasBusinessId(String businessId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("business").get("id"), businessId);
    }

    private static Specification<Media> hasStatus(MediaStatus status) {
        return (root, query, criteriaBuilder) -> status == null
                ? null
                : criteriaBuilder.equal(root.get("status"), status);
    }
}
