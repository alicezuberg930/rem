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
import server.rem.dtos.APIResponse;
import server.rem.dtos.CustomPageResponse;
import server.rem.dtos.customer.CreateCustomerRequest;
import server.rem.dtos.customer.CustomerResponse;
import server.rem.dtos.customer.QueryCustomer;
import server.rem.services.CustomerService;

@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService customerService;

    @GetMapping
    @PreAuthorize("hasAuthority('customer.read')")
    public ResponseEntity<APIResponse<CustomPageResponse<CustomerResponse>>> getAll(
            @ModelAttribute QueryCustomer dto,
            @RequestAttribute("businessId") String businessId
    ) {
        return ResponseEntity.ok(APIResponse.success(200, "Customers fetched successfully", customerService.getAll(dto, businessId)));
    }

    @GetMapping("/export")
    @PreAuthorize("hasAuthority('customer.export')")
    public ResponseEntity<StreamingResponseBody> export(
            @ModelAttribute QueryCustomer dto,
            @RequestAttribute("businessId") String businessId
    ) {
        String filename = "customers-" + LocalDate.now() + ".xlsx";
        StreamingResponseBody body = outputStream -> customerService.writeExcel(dto, businessId, outputStream);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(body);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('customer.read')")
    public ResponseEntity<APIResponse<CustomerResponse>> getOne(
            @PathVariable String id,
            @RequestAttribute("businessId") String businessId
    ) {
        return ResponseEntity.ok(APIResponse.success(200, "Customer fetched", customerService.getOne(id, businessId)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('customer.create')")
    public ResponseEntity<APIResponse<CustomerResponse>> create(
            @Valid @RequestBody CreateCustomerRequest dto,
            @RequestAttribute("businessId") String businessId
    ) {
        return ResponseEntity.ok(APIResponse.success(201, "Customer created", customerService.create(dto, businessId)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('customer.edit')")
    public ResponseEntity<APIResponse<CustomerResponse>> update(
            @PathVariable String id,
            @Valid @RequestBody CreateCustomerRequest dto,
            @RequestAttribute("businessId") String businessId
    ) {
        return ResponseEntity.ok(APIResponse.success(200, "Customer updated", customerService.update(id, dto, businessId)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('customer.delete')")
    public ResponseEntity<APIResponse<Void>> delete(
            @PathVariable String id,
            @RequestAttribute("businessId") String businessId
    ) {
        customerService.delete(id, businessId);
        return ResponseEntity.ok(APIResponse.success(200, "Customer deleted", null));
    }
}
