package server.rem.jobs;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import server.rem.entities.Campaign;
import server.rem.enums.CampaignStatus;
import server.rem.repositories.CampaignRepository;
import server.rem.services.CampaignService;
import server.rem.utils.exceptions.ResourceNotFoundException;

@Slf4j
@Component
@RequiredArgsConstructor
public class CampaignJob implements Job {
    // Use @Autowired here instead of constructor dependency injection. Quartz
    // instantiates this itself
    // @Autowired
    private final CampaignRepository campaignRepository;

    // @Autowired
    private final CampaignService campaignService;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        // Retrieve campaignId passed when the job was scheduled
        String campaignId = context.getJobDetail()
                .getJobDataMap()
                .getString("campaignId");

        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));

        // skip if already sent or cancelled
        if (campaign.getStatus() != CampaignStatus.PENDING) {
            log.warn("Campaign {} is not PENDING ({}), skipping", campaignId, campaign.getStatus());
            return;
        }
        try {
            campaignService.send(campaignId, campaign.getBusiness().getId());
            log.info("Campaign {} sent successfully", campaignId);
        } catch (Exception e) {
            log.error("Failed to send campaign {}", campaignId, e);
            throw new JobExecutionException(e);
        } finally {
            campaignRepository.save(campaign);
        }
    }
}