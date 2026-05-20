package server.rem.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import server.rem.dtos.*;
import server.rem.dtos.campaign.*;
import server.rem.services.CampaignService;
import server.rem.utils.messages.CampaignMessages;

@RestController
@RequestMapping("/campaigns")
@RequiredArgsConstructor
public class CampaignController {
    private final CampaignService campaignService;

    @PostMapping
    @PreAuthorize("hasAuthority('campaign.create')")
    public ResponseEntity<APIResponse<CampaignResponse>> create(
        @Valid @RequestBody CreateCampaignRequest dto, 
        @RequestAttribute("businessId") String businessId
    ) throws Exception {
        return ResponseEntity.ok().body(APIResponse.success(
            201,
            CampaignMessages.CREATED,
            campaignService.create(dto, businessId))
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('campaign.edit')")
    public ResponseEntity<APIResponse<CampaignResponse>> update(
        @Valid @RequestBody UpdateCampaignRequest dto, 
        @RequestAttribute("businessId") String businessId,
        @PathVariable String id
    ) throws Exception {
        return ResponseEntity.ok().body(APIResponse.success(
            200,
            CampaignMessages.UPDATED,
            campaignService.update(dto, businessId, id))
        );
    }

    @GetMapping
    @PreAuthorize("hasAuthority('campaign.view')")
    public ResponseEntity<APIResponse<CustomPageResponse<CampaignResponse>>> getAll(
        @ModelAttribute QueryCampaign dto, 
        @RequestAttribute("businessId") String businessId
    ) {
        return ResponseEntity.ok().body(APIResponse.success(
            200,
            CampaignMessages.LIST_RETRIEVED,
            campaignService.getAll(dto, businessId))
        );
    }
}