package server.rem.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import lombok.RequiredArgsConstructor;
import server.rem.dtos.APIResponse;
import server.rem.dtos.CustomPageResponse;
import server.rem.dtos.variant.CreateVariantRequest;
import server.rem.dtos.variant.QueryVariant;
import server.rem.dtos.variant.VariantResponse;
import server.rem.services.VariantService;

@RestController
@RequestMapping("/variants")
@RequiredArgsConstructor
public class VariantController {
    private final VariantService variantService;

    @PostMapping
    public ResponseEntity<APIResponse<VariantResponse>> create(
            @Valid @RequestBody CreateVariantRequest dto,
            @RequestAttribute("businessId") String businessId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(APIResponse.success(
                HttpStatus.CREATED.value(),
                "Variant created successfully",
                variantService.create(dto, businessId)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<APIResponse<VariantResponse>> update(
            @PathVariable String id,
            @Valid @RequestBody CreateVariantRequest dto,
            @RequestAttribute("businessId") String businessId) {
        return ResponseEntity.ok(APIResponse.success(
                HttpStatus.OK.value(),
                "Variant updated successfully",
                variantService.update(dto, id, businessId)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<VariantResponse>> delete(
            @PathVariable String id,
            @RequestAttribute("businessId") String businessId) {
        return ResponseEntity.ok(APIResponse.success(
                HttpStatus.OK.value(),
                "Variant deleted successfully",
                variantService.delete(id, businessId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<VariantResponse>> getById(
            @PathVariable String id,
            @RequestAttribute("businessId") String businessId) {
        return ResponseEntity.ok(APIResponse.success(
                HttpStatus.OK.value(),
                "Variant retrieved successfully",
                variantService.getById(id, businessId)));
    }

    @GetMapping
    public ResponseEntity<APIResponse<CustomPageResponse<VariantResponse>>> getAll(
            @ModelAttribute QueryVariant dto,
            @RequestAttribute("businessId") String businessId) {
        return ResponseEntity.ok(APIResponse.success(
                HttpStatus.OK.value(),
                "Variant list retrieved successfully",
                variantService.getAll(dto, businessId)));
    }
}
