package server.rem.specifications;

import org.springframework.data.jpa.domain.Specification;

import server.rem.dtos.campaign.QueryCampaign;
import server.rem.entities.Campaign;

public class CampaignSpecification {

    public static Specification<Campaign> withFilters(QueryCampaign dto, String businessId) {
        return Specification.where(hasBusinessId(businessId));
    }

    private static Specification<Campaign> hasBusinessId(String businessId) {
        return (root, query, cb) -> cb.equal(root.get("business").get("id"), businessId);
    }
}
