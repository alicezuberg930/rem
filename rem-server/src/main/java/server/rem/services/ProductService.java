package server.rem.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import server.rem.dtos.product.CreateProductRequest;
import server.rem.entities.Business;
import server.rem.entities.Product;
import server.rem.mappers.ProductMapper;
import server.rem.repositories.BusinessRepository;
import server.rem.repositories.ProductRepository;
import server.rem.utils.exceptions.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final BusinessRepository businessRepository;
    private final ProductMapper productMapper;

    public List<Product> getAll(String businessId) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found"));
        return productRepository.findAllByBusinessId(business.getId());
    }

    public Product getById(String businessId, String productId) {
        return productRepository.findByIdAndBusinessId(productId, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    @Transactional
    public Product create(String businessId, CreateProductRequest dto) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found"));

        Product product = productMapper.toEntity(dto, business);
        return productRepository.save(product);
    }

    @Transactional
    public Product update(String businessId, String productId, CreateProductRequest dto) {
        Product product = productRepository.findByIdAndBusinessId(productId, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        productMapper.updateEntity(dto, product);
        return productRepository.save(product);
    }
}
