package server.rem.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import server.rem.common.messages.TemplateMessages;
import server.rem.dtos.APIResponse;
import server.rem.dtos.CustomPageResponse;
import server.rem.dtos.template.CreateTemplateRequest;
import server.rem.dtos.template.QueryTemplate;
import server.rem.dtos.template.TemplateResponse;
import server.rem.dtos.template.UpdateTemplateRequest;
import server.rem.entities.Template;
import server.rem.services.TemplateService;

@RestController
@RequestMapping("/templates")
@AllArgsConstructor
public class TemplateController {
    private final TemplateService templateService;

    @PostMapping
    @PreAuthorize("hasAuthority('template.create')")
    public ResponseEntity<APIResponse<Template>> create(
        @Valid @RequestBody CreateTemplateRequest dto,         
        @RequestAttribute("businessId") String businessId
    ) {
        return ResponseEntity.ok().body(APIResponse.success(
            201,
            TemplateMessages.CREATED,
            templateService.create(dto, businessId))
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('template.edit')")
    public ResponseEntity<APIResponse<Template>> update(
        @Valid @RequestBody UpdateTemplateRequest dto,
        @PathVariable String id,  
        @RequestAttribute("businessId") String businessId
    ) {
        return ResponseEntity.ok().body(APIResponse.success(
            200,
            TemplateMessages.UPDATED,
            templateService.update(dto, id, businessId))
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('template.delete')")
    public ResponseEntity<APIResponse<Template>> delete(
        @PathVariable String id,  
        @RequestAttribute("businessId") String businessId
    ) {
        return ResponseEntity.ok().body(APIResponse.success(
            200,
            TemplateMessages.DELETED,
            templateService.delete(id, businessId))
        );
    }

    @GetMapping
    @PreAuthorize("hasAuthority('template.view')")
    public ResponseEntity<APIResponse<CustomPageResponse<TemplateResponse>>> getTemplates(@ModelAttribute QueryTemplate dto, @RequestAttribute("businessId") String businessId) {
        return ResponseEntity.ok().body(APIResponse.success(
            200,
            TemplateMessages.LIST_RETRIEVED,
            templateService.getAll(dto, businessId))
        );
    }
}
