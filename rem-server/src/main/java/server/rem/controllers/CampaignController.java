package server.rem.controllers;

import java.time.LocalDate;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

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

    @GetMapping("/export")
    @PreAuthorize("hasAuthority('campaign.view')")
    public ResponseEntity<StreamingResponseBody> export(
        @ModelAttribute QueryCampaign dto,
        @RequestAttribute("businessId") String businessId
    ) {
        String filename = "campaigns-" + LocalDate.now() + ".xlsx";
        StreamingResponseBody body = outputStream -> campaignService.writeExcel(dto, businessId, outputStream);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(body);
    }
}
