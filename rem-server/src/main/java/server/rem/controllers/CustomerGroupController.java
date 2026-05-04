package server.rem.controllers;
 
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import server.rem.dtos.APIResponse;
import server.rem.dtos.customer_group.CreateCustomerGroupRequest;
import server.rem.dtos.customer_group.QueryCustomerGroup;
import server.rem.entities.CustomerGroup;
import server.rem.services.CustomerGroupService;
 
import java.util.List;
 
@RestController
@RequestMapping("/customer-groups")
@RequiredArgsConstructor
public class CustomerGroupController {
    private final CustomerGroupService customerGroupService;
 
    @GetMapping
    public ResponseEntity<APIResponse<List<CustomerGroup>>> getAll(
        @ModelAttribute QueryCustomerGroup dto, 
        @RequestAttribute("businessId") String businessId
    ) {
        return ResponseEntity.ok(APIResponse.success(
            200, 
            "Customer groups fetched sucessfully", 
            customerGroupService.getAll(dto, businessId))
        );
    }
 
    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<CustomerGroup>> getById(@PathVariable String id) {
        return ResponseEntity.ok(APIResponse.success(
            200, 
            "Customer group fetched successfully", 
            customerGroupService.getById(id))
        );
    }
 
    @PostMapping
    public ResponseEntity<APIResponse<CustomerGroup>> create(@Valid @RequestBody CreateCustomerGroupRequest dto) {
        return ResponseEntity.ok(APIResponse.success(
            201, 
            "Customer group created", 
            customerGroupService.create(dto))
        );
    }
 
    @PutMapping("/{id}")
    public ResponseEntity<APIResponse<CustomerGroup>> update(@PathVariable String id, @Valid @RequestBody CreateCustomerGroupRequest dto) {
        return ResponseEntity.ok(APIResponse.success(
            200, 
            "Customer group updated", 
            customerGroupService.update(id, dto))
        );
    }
 
    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<Void>> delete(@PathVariable String id) {
        customerGroupService.delete(id);
        return ResponseEntity.ok(APIResponse.success(200, "Customer group deleted", null));
    }
}