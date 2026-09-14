package server.rem.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import server.rem.entities.Campaign;
import server.rem.entities.CampaignContact;
import server.rem.entities.CampaignContactId;

import java.util.List;

public interface CampaignContactRepository extends JpaRepository<CampaignContact, CampaignContactId> {
    /**
     * Loads all campaign-contact mapping rows for a campaign.
     *
     * @param campaign target campaign
     * @return association rows for the campaign
     */
    List<CampaignContact> findAllByCampaign(Campaign campaign);

    // List<BusinessUser> findByBusiness(Business business);
    // List<BusinessUser> findByUser(User user);
    // Optional<BusinessUser> findByBusinessAndUser(Business business, User user);
}
