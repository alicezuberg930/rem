package server.rem.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<APIResponse<CustomPageResponse<CustomerResponse>>> getAll(
            @ModelAttribute QueryCustomer dto,
            @RequestAttribute("businessId") String businessId
    ) {
        return ResponseEntity.ok(APIResponse.success(200, "Customers fetched successfully", customerService.getAll(dto, businessId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<CustomerResponse>> getOne(
            @PathVariable String id,
            @RequestAttribute("businessId") String businessId
    ) {
        return ResponseEntity.ok(APIResponse.success(200, "Customer fetched", customerService.getOne(id, businessId)));
    }

    @PostMapping
    public ResponseEntity<APIResponse<CustomerResponse>> create(
            @Valid @RequestBody CreateCustomerRequest dto,
            @RequestAttribute("businessId") String businessId
    ) {
        return ResponseEntity.ok(APIResponse.success(201, "Customer created", customerService.create(dto, businessId)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<APIResponse<CustomerResponse>> update(
            @PathVariable String id,
            @Valid @RequestBody CreateCustomerRequest dto,
            @RequestAttribute("businessId") String businessId
    ) {
        return ResponseEntity.ok(APIResponse.success(200, "Customer updated", customerService.update(id, dto, businessId)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<Void>> delete(
            @PathVariable String id,
            @RequestAttribute("businessId") String businessId
    ) {
        customerService.delete(id, businessId);
        return ResponseEntity.ok(APIResponse.success(200, "Customer deleted", null));
    }
}
