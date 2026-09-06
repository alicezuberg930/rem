package server.rem.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import server.rem.dtos.APIResponse;
import server.rem.dtos.CustomPageResponse;
import server.rem.dtos.customer.CustomerResponse;
import server.rem.dtos.lead.ConvertLeadsRequest;
import server.rem.dtos.lead.CreateLeadRequest;
import server.rem.dtos.lead.LeadResponse;
import server.rem.dtos.lead.QueryLead;
import server.rem.services.LeadService;

@RestController
@RequestMapping("/leads")
@RequiredArgsConstructor
public class LeadController {
    private final LeadService leadService;

    @GetMapping
    public ResponseEntity<APIResponse<CustomPageResponse<LeadResponse>>> getAll(
            @ModelAttribute QueryLead dto,
            @RequestAttribute("businessId") String businessId
    ) {
        return ResponseEntity.ok(APIResponse.success(200, "Leads fetched successfully", leadService.getAll(dto, businessId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<LeadResponse>> getOne(
            @PathVariable String id,
            @RequestAttribute("businessId") String businessId
    ) {
        return ResponseEntity.ok(APIResponse.success(200, "Lead fetched", leadService.getOne(id, businessId)));
    }

    @PostMapping
    public ResponseEntity<APIResponse<LeadResponse>> create(
            @Valid @RequestBody CreateLeadRequest dto,
            @RequestAttribute("businessId") String businessId
    ) {
        return ResponseEntity.ok(APIResponse.success(201, "Lead created", leadService.create(dto, businessId)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<APIResponse<LeadResponse>> update(
            @PathVariable String id,
            @Valid @RequestBody CreateLeadRequest dto,
            @RequestAttribute("businessId") String businessId
    ) {
        return ResponseEntity.ok(APIResponse.success(200, "Lead updated", leadService.update(id, dto, businessId)));
    }

    @PutMapping("/convert")
    public ResponseEntity<APIResponse<List<CustomerResponse>>> convert(
            @Valid @RequestBody ConvertLeadsRequest dto,
            @RequestAttribute("businessId") String businessId
    ) {
        return ResponseEntity.ok(APIResponse.success(200, "Leads converted", leadService.convert(dto, businessId)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<Void>> delete(
            @PathVariable String id,
            @RequestAttribute("businessId") String businessId
    ) {
        leadService.delete(id, businessId);
        return ResponseEntity.ok(APIResponse.success(200, "Lead deleted", null));
    }
}
