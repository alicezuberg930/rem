package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import server.rem.dtos.product.CreateProductRequest;
import server.rem.dtos.product.CreateProductRequest.ProductVariantCombinationRequest;
import server.rem.dtos.product.ProductResponse;
import server.rem.dtos.variant.VariantResponse;
import server.rem.entities.Business;
import server.rem.entities.Product;
import server.rem.entities.ProductVariantCombination;
import server.rem.entities.Variant;
import server.rem.entities.VariantOption;
import server.rem.enums.BarCodeType;
import server.rem.enums.VariantMode;
import server.rem.mappers.ProductMapper;
import server.rem.mappers.ProductMapperImpl;
import server.rem.mappers.VariantMapper;
import server.rem.repositories.BusinessRepository;
import server.rem.repositories.ProductRepository;
import server.rem.repositories.ProductVariantCombinationRepository;
import server.rem.repositories.VariantRepository;
import server.rem.utils.exceptions.ResourceNotFoundException;

@ExtendWith(MockitoExtension.class)
class ProductServiceTests {
    @Mock
    private ProductRepository productRepository;
    @Mock
    private ProductVariantCombinationRepository combinationRepository;
    @Mock
    private VariantRepository variantRepository;
    @Mock
    private BusinessRepository businessRepository;
    @Spy
    private ProductMapper productMapper = new ProductMapperImpl();
    @Mock
    private VariantMapper variantMapper;

    private ProductService productService;

    @BeforeEach
    void setUp() {
        productService = new ProductService(
                productRepository,
                combinationRepository,
                variantRepository,
                businessRepository,
                productMapper,
                variantMapper);
    }

    @Test
    void createsTwoVariantProductWithCompleteCartesianCombinations() {
        Business business = business("business-1");
        Variant color = variant("variant-color", "Color", "red", "blue");
        Variant size = variant("variant-size", "Size", "small", "large");
        CreateProductRequest request = variableRequest(
                List.of(color.getId(), size.getId()),
                List.of(
                        combination(null, List.of("red", "small"), "TSHIRT-RED-S", 1200L),
                        combination(null, List.of("red", "large"), "TSHIRT-RED-L", 1300L),
                        combination(null, List.of("blue", "small"), "TSHIRT-BLUE-S", 1400L),
                        combination(null, List.of("blue", "large"), "TSHIRT-BLUE-L", 1500L)));
        Product product = product("product-1", VariantMode.VARIABLE);
        VariantResponse colorResponse = variantResponse(color);
        VariantResponse sizeResponse = variantResponse(size);

        when(businessRepository.findById("business-1")).thenReturn(Optional.of(business));
        when(variantRepository.findAllWithOptionsByBusinessIdAndIdIn(
                "business-1", List.of(color.getId(), size.getId())))
                .thenReturn(List.of(size, color));
        when(productMapper.toEntity(request, business)).thenReturn(product);
        when(productRepository.saveAndFlush(product)).thenReturn(product);
        when(combinationRepository.findAllWithOptionsByProductId("product-1")).thenReturn(List.of());
        AtomicInteger sequence = new AtomicInteger();
        when(combinationRepository.saveAllAndFlush(anyList())).thenAnswer(invocation -> {
            List<ProductVariantCombination> combinations = invocation.getArgument(0);
            combinations.forEach(combination -> combination.setId("combination-" + sequence.incrementAndGet()));
            return combinations;
        });
        when(variantMapper.toResponse(color)).thenReturn(colorResponse);
        when(variantMapper.toResponse(size)).thenReturn(sizeResponse);

        ProductResponse result = productService.create("business-1", request);

        assertEquals(List.of(colorResponse, sizeResponse), result.getVariants());
        assertEquals(4, result.getCombinations().size());
        assertEquals(
                List.of("red", "small"),
                result.getCombinations().get(0).getVariantOptions().stream().map(option -> option.getId()).toList());
        assertEquals(List.of(color, size), product.getVariants());
        assertNull(product.getPrice());
    }

    @Test
    void supportsOneVariantProducts() {
        Business business = business("business-1");
        Variant color = variant("variant-color", "Color", "red", "blue");
        CreateProductRequest request = variableRequest(
                List.of(color.getId()),
                List.of(
                        combination(null, List.of("red"), "TSHIRT-RED", 1200L),
                        combination(null, List.of("blue"), "TSHIRT-BLUE", 1300L)));
        Product product = product("product-1", VariantMode.VARIABLE);

        when(businessRepository.findById("business-1")).thenReturn(Optional.of(business));
        when(variantRepository.findAllWithOptionsByBusinessIdAndIdIn("business-1", List.of(color.getId())))
                .thenReturn(List.of(color));
        when(productMapper.toEntity(request, business)).thenReturn(product);
        when(productRepository.saveAndFlush(product)).thenReturn(product);
        when(combinationRepository.findAllWithOptionsByProductId("product-1")).thenReturn(List.of());
        when(combinationRepository.saveAllAndFlush(anyList())).thenAnswer(invocation -> {
            List<ProductVariantCombination> combinations = invocation.getArgument(0);
            combinations.forEach(combination -> combination.setId("combination-" + combination.getSku()));
            return combinations;
        });
        when(variantMapper.toResponse(color)).thenReturn(variantResponse(color));

        ProductResponse result = productService.create("business-1", request);

        assertEquals(2, result.getCombinations().size());
        assertEquals(1, result.getCombinations().get(0).getVariantOptions().size());
        assertNull(product.getPrice());
    }

    @Test
    void rejectsPartialCartesianCombinations() {
        Variant color = variant("variant-color", "Color", "red", "blue");
        Variant size = variant("variant-size", "Size", "small", "large");
        CreateProductRequest request = variableRequest(
                List.of(color.getId(), size.getId()),
                List.of(
                        combination(null, List.of("red", "small"), "RED-S", 1200L),
                        combination(null, List.of("blue", "large"), "BLUE-L", 1300L)));

        when(businessRepository.findById("business-1")).thenReturn(Optional.of(business("business-1")));
        when(variantRepository.findAllWithOptionsByBusinessIdAndIdIn(
                "business-1", List.of(color.getId(), size.getId())))
                .thenReturn(List.of(color, size));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> productService.create("business-1", request));

        assertEquals(
                "Combinations must cover the complete Cartesian product of variant options",
                exception.getMessage());
        verify(productRepository, never()).saveAndFlush(org.mockito.ArgumentMatchers.any());
    }

    @Test
    void rejectsCombinationOptionsInTheWrongVariantOrder() {
        Variant color = variant("variant-color", "Color", "red");
        Variant size = variant("variant-size", "Size", "small");
        CreateProductRequest request = variableRequest(
                List.of(color.getId(), size.getId()),
                List.of(combination(null, List.of("small", "red"), "RED-S", 1200L)));

        when(businessRepository.findById("business-1")).thenReturn(Optional.of(business("business-1")));
        when(variantRepository.findAllWithOptionsByBusinessIdAndIdIn(
                "business-1", List.of(color.getId(), size.getId())))
                .thenReturn(List.of(color, size));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> productService.create("business-1", request));

        assertEquals("Combination options must follow the selected variant order", exception.getMessage());
    }

    @Test
    void rejectsDuplicateVariants() {
        CreateProductRequest request = variableRequest(
                List.of("variant-color", "variant-color"),
                List.of());
        when(businessRepository.findById("business-1")).thenReturn(Optional.of(business("business-1")));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> productService.create("business-1", request));

        assertEquals("Selected variants must be distinct", exception.getMessage());
        verify(variantRepository, never()).findAllWithOptionsByBusinessIdAndIdIn(
                org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.anyCollection());
    }

    @Test
    void rejectsVariantFromAnotherTenant() {
        CreateProductRequest request = variableRequest(List.of("foreign-variant"), List.of());
        when(businessRepository.findById("business-1")).thenReturn(Optional.of(business("business-1")));
        when(variantRepository.findAllWithOptionsByBusinessIdAndIdIn(
                "business-1", List.of("foreign-variant")))
                .thenReturn(List.of());

        assertThrows(ResourceNotFoundException.class, () -> productService.create("business-1", request));
    }

    @Test
    void preservesCombinationIdAndOrdersLegacyOptionsBySelectedVariants() {
        Variant color = variant("variant-color", "Color", "red");
        Variant size = variant("variant-size", "Size", "small");
        Product product = product("product-1", VariantMode.VARIABLE);
        product.getVariants().addAll(List.of(color, size));
        ProductVariantCombination existing = ProductVariantCombination.builder()
                .product(product)
                .sku("RED-S")
                .price(1200L)
                .variantValue1(size.getOptions().get(0))
                .variantValue2(color.getOptions().get(0))
                .build();
        existing.setId("combination-1");
        CreateProductRequest request = variableRequest(
                List.of(size.getId(), color.getId()),
                List.of(combination(null, List.of("small", "red"), "RED-S", 1250L)));

        when(productRepository.findByIdAndBusinessId("product-1", "business-1"))
                .thenReturn(Optional.of(product));
        when(variantRepository.findAllWithOptionsByBusinessIdAndIdIn(
                "business-1", List.of(size.getId(), color.getId())))
                .thenReturn(List.of(color, size));
        when(productRepository.saveAndFlush(product)).thenReturn(product);
        when(combinationRepository.findAllWithOptionsByProductId("product-1"))
                .thenReturn(List.of(existing));
        when(combinationRepository.saveAllAndFlush(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        when(variantMapper.toResponse(size)).thenReturn(variantResponse(size));
        when(variantMapper.toResponse(color)).thenReturn(variantResponse(color));

        ProductResponse result = productService.update("business-1", "product-1", request);

        assertEquals("combination-1", result.getCombinations().get(0).getId());
        assertEquals(
                List.of("small", "red"),
                result.getCombinations().get(0).getVariantOptions().stream().map(option -> option.getId()).toList());
        assertSame(size.getOptions().get(0), existing.getVariantValue1());
        assertSame(color.getOptions().get(0), existing.getVariantValue2());
    }

    @Test
    void rejectsMoreThanOneThousandCartesianCombinations() {
        Variant first = variantWithOptionCount("variant-1", "First", 32, "first");
        Variant second = variantWithOptionCount("variant-2", "Second", 32, "second");
        CreateProductRequest request = variableRequest(List.of(first.getId(), second.getId()), List.of());

        when(businessRepository.findById("business-1")).thenReturn(Optional.of(business("business-1")));
        when(variantRepository.findAllWithOptionsByBusinessIdAndIdIn(
                "business-1", List.of(first.getId(), second.getId())))
                .thenReturn(List.of(first, second));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> productService.create("business-1", request));

        assertEquals("A product can have at most 1000 variant combinations", exception.getMessage());
    }

    @Test
    void rejectsSimpleProductWithoutBasePrice() {
        CreateProductRequest request = new CreateProductRequest(
                "T-Shirt",
                "TSHIRT",
                "piece",
                BarCodeType.CODE_128,
                null,
                null,
                null,
                null,
                VariantMode.SIMPLE,
                List.of(),
                List.of());

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> productService.create("business-1", request));

        assertEquals("Price is required for simple products", exception.getMessage());
        verify(businessRepository, never()).findById(org.mockito.ArgumentMatchers.anyString());
    }

    private CreateProductRequest variableRequest(
            List<String> variantIds,
            List<ProductVariantCombinationRequest> combinations) {
        return new CreateProductRequest(
                "T-Shirt",
                "TSHIRT",
                "piece",
                BarCodeType.CODE_128,
                null,
                null,
                null,
                null,
                VariantMode.VARIABLE,
                variantIds,
                combinations);
    }

    private ProductVariantCombinationRequest combination(
            String id,
            List<String> optionIds,
            String sku,
            Long price) {
        return new ProductVariantCombinationRequest(id, optionIds, sku, price);
    }

    private Business business(String id) {
        Business business = new Business();
        business.setId(id);
        return business;
    }

    private Product product(String id, VariantMode mode) {
        Product product = Product.builder()
                .name("T-Shirt")
                .sku("TSHIRT")
                .unit("piece")
                .barCodeType(BarCodeType.CODE_128)
                .variantMode(mode)
                .build();
        product.setId(id);
        return product;
    }

    private Variant variant(String id, String name, String... optionIds) {
        Variant variant = Variant.builder().name(name).options(new ArrayList<>()).build();
        variant.setId(id);
        for (String optionId : optionIds) {
            VariantOption option = VariantOption.builder()
                    .name(optionId)
                    .value(optionId)
                    .variant(variant)
                    .build();
            option.setId(optionId);
            variant.getOptions().add(option);
        }
        return variant;
    }

    private Variant variantWithOptionCount(String id, String name, int count, String prefix) {
        String[] optionIds = new String[count];
        for (int index = 0; index < count; index++) {
            optionIds[index] = prefix + "-" + index;
        }
        return variant(id, name, optionIds);
    }

    private VariantResponse variantResponse(Variant variant) {
        return new VariantResponse(
                variant.getId(),
                variant.getName(),
                variant.getOptions().stream()
                        .map(option -> new VariantResponse.VariantOptionResponse(
                                option.getId(), option.getValue()))
                        .toList());
    }
}
