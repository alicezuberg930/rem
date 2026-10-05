package server.rem.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
import server.rem.dtos.product.CreateProductRequest;
import server.rem.dtos.product.ProductResponse;
import server.rem.services.ProductService;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<APIResponse<List<ProductResponse>>> getAll(@RequestAttribute("businessId") String businessId) {
        return ResponseEntity.ok(APIResponse.success(
                200,
                "Products fetched successfully",
                productService.getAll(businessId)
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<ProductResponse>> getById(
            @PathVariable String id,
            @RequestAttribute("businessId") String businessId) {
        return ResponseEntity.ok(APIResponse.success(
                200,
                "Product fetched successfully",
                productService.getById(businessId, id)
        ));
    }

    @PostMapping
    public ResponseEntity<APIResponse<ProductResponse>> create(
            @RequestAttribute("businessId") String businessId,
            @Valid @RequestBody CreateProductRequest dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(APIResponse.success(
                HttpStatus.CREATED.value(),
                "Product created successfully",
                productService.create(businessId, dto)
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<APIResponse<ProductResponse>> update(
            @PathVariable String id,
            @RequestAttribute("businessId") String businessId,
            @Valid @RequestBody CreateProductRequest dto) {
        return ResponseEntity.ok(APIResponse.success(
                200,
                "Product updated successfully",
                productService.update(businessId, id, dto)
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<ProductResponse>> delete(
            @PathVariable String id,
            @RequestAttribute("businessId") String businessId) {
        return ResponseEntity.ok(APIResponse.success(
                HttpStatus.OK.value(),
                "Product deleted successfully",
                productService.delete(businessId, id)
        ));
    }
}
