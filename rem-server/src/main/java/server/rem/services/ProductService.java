package server.rem.services;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import server.rem.dtos.product.CreateProductRequest;
import server.rem.dtos.product.CreateProductRequest.ProductVariantCombinationRequest;
import server.rem.dtos.product.ProductResponse;
import server.rem.dtos.product.ProductResponse.ProductVariantCombinationResponse;
import server.rem.dtos.variant.VariantResponse;
import server.rem.entities.Business;
import server.rem.entities.Product;
import server.rem.entities.ProductVariantCombination;
import server.rem.entities.Variant;
import server.rem.entities.VariantOption;
import server.rem.enums.VariantMode;
import server.rem.mappers.ProductMapper;
import server.rem.mappers.VariantMapper;
import server.rem.repositories.BusinessRepository;
import server.rem.repositories.ProductRepository;
import server.rem.repositories.ProductVariantCombinationRepository;
import server.rem.repositories.VariantRepository;
import server.rem.utils.exceptions.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
public class ProductService {
    private static final int MAX_VARIANTS = 2;
    private static final int MAX_COMBINATIONS = 1_000;
    private static final String COMBINATION_KEY_SEPARATOR = "\u001f";

    private final ProductRepository productRepository;
    private final ProductVariantCombinationRepository combinationRepository;
    private final VariantRepository variantRepository;
    private final BusinessRepository businessRepository;
    private final ProductMapper productMapper;
    private final VariantMapper variantMapper;

    @Transactional(readOnly = true)
    public List<ProductResponse> getAll(String businessId) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found"));
        return productRepository.findAllByBusinessId(business.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse getById(String businessId, String productId) {
        return toResponse(findProduct(businessId, productId));
    }

    @Transactional
    public ProductResponse create(String businessId, CreateProductRequest dto) {
        validateProductPricing(dto);
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found"));
        List<Variant> selectedVariants = validateVariantConfiguration(dto, businessId);

        Product product = productMapper.toEntity(dto, business);
        setSelectedVariants(product, selectedVariants);
        Product savedProduct = productRepository.saveAndFlush(product);
        List<ProductVariantCombination> combinations = replaceCombinations(
                savedProduct,
                selectedVariants,
                dto.getCombinations());
        return toResponse(savedProduct, selectedVariants, combinations);
    }

    @Transactional
    public ProductResponse update(String businessId, String productId, CreateProductRequest dto) {
        validateProductPricing(dto);
        Product product = findProduct(businessId, productId);
        List<Variant> selectedVariants = validateVariantConfiguration(dto, businessId);

        productMapper.updateEntity(dto, product);
        replaceSelectedVariants(product, selectedVariants);
        Product savedProduct = productRepository.saveAndFlush(product);
        List<ProductVariantCombination> combinations = replaceCombinations(
                savedProduct,
                selectedVariants,
                dto.getCombinations());
        return toResponse(savedProduct, selectedVariants, combinations);
    }

    @Transactional
    public ProductResponse delete(String businessId, String productId) {
        Product product = findProduct(businessId, productId);
        ProductResponse response = toResponse(product);

        combinationRepository.deleteAllByProductId(productId);
        product.getVariants().clear();
        productRepository.saveAndFlush(product);
        productRepository.delete(product);
        productRepository.flush();

        return response;
    }

    private Product findProduct(String businessId, String productId) {
        return productRepository.findByIdAndBusinessId(productId, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    private void validateProductPricing(CreateProductRequest dto) {
        if (dto.getPrice() != null && dto.getPrice() < 0) {
            throw new IllegalArgumentException("Price must be zero or greater");
        }
        if (dto.getVariantMode() == VariantMode.SIMPLE && dto.getPrice() == null) {
            throw new IllegalArgumentException("Price is required for simple products");
        }
    }

    private List<Variant> validateVariantConfiguration(CreateProductRequest dto, String businessId) {
        List<String> variantIds = normalizeIds(dto.getVariantIds());
        List<ProductVariantCombinationRequest> combinations = dto.getCombinations() == null
                ? List.of()
                : dto.getCombinations();

        if (dto.getVariantMode() == VariantMode.SIMPLE) {
            if (!variantIds.isEmpty() || !combinations.isEmpty()) {
                throw new IllegalArgumentException("Simple products cannot have variants or combinations");
            }
            return List.of();
        }

        if (variantIds.isEmpty() || variantIds.size() > MAX_VARIANTS) {
            throw new IllegalArgumentException("Variable products must have one or two variants");
        }
        if (new HashSet<>(variantIds).size() != variantIds.size()) {
            throw new IllegalArgumentException("Selected variants must be distinct");
        }

        Map<String, Variant> variantsById = variantRepository
                .findAllWithOptionsByBusinessIdAndIdIn(businessId, variantIds)
                .stream()
                .collect(Collectors.toMap(Variant::getId, Function.identity()));
        if (variantsById.size() != variantIds.size()) {
            throw new ResourceNotFoundException("Variant not found");
        }

        List<Variant> variants = variantIds.stream().map(variantsById::get).toList();
        if (variants.stream().anyMatch(variant -> variant.getOptions().isEmpty())) {
            throw new IllegalArgumentException("Selected variants must have at least one option");
        }
        validateCartesianCombinations(variants, combinations);
        return variants;
    }

    private void validateCartesianCombinations(
            List<Variant> variants,
            List<ProductVariantCombinationRequest> combinations) {
        long expectedCombinationCount = variants.stream()
                .mapToLong(variant -> variant.getOptions().size())
                .reduce(1L, Math::multiplyExact);
        if (expectedCombinationCount > MAX_COMBINATIONS) {
            throw new IllegalArgumentException(
                    "A product can have at most " + MAX_COMBINATIONS + " variant combinations");
        }

        List<Map<String, VariantOption>> optionsByVariant = variants.stream()
                .map(variant -> variant.getOptions().stream()
                        .collect(Collectors.toMap(VariantOption::getId, Function.identity())))
                .toList();

        Set<String> actualKeys = new HashSet<>();
        for (ProductVariantCombinationRequest combination : combinations) {
            if (combination == null) {
                throw new IllegalArgumentException("Combination is required");
            }
            List<String> optionIds = normalizeIds(combination.getVariantOptionIds());
            if (optionIds.size() != variants.size()) {
                throw new IllegalArgumentException(
                        "Each combination must contain one option for every selected variant");
            }
            for (int index = 0; index < optionIds.size(); index++) {
                if (!optionsByVariant.get(index).containsKey(optionIds.get(index))) {
                    throw new IllegalArgumentException(
                            "Combination options must follow the selected variant order");
                }
            }
            if (!actualKeys.add(orderedCombinationKey(optionIds))) {
                throw new IllegalArgumentException("Variant combinations must be unique");
            }
        }

        Set<String> expectedKeys = expectedCombinationKeys(variants);
        if (!actualKeys.equals(expectedKeys)) {
            throw new IllegalArgumentException(
                    "Combinations must cover the complete Cartesian product of variant options");
        }
    }

    private Set<String> expectedCombinationKeys(List<Variant> variants) {
        Set<String> keys = new HashSet<>();
        if (variants.size() == 1) {
            variants.get(0).getOptions().forEach(option -> keys.add(orderedCombinationKey(List.of(option.getId()))));
            return keys;
        }

        for (VariantOption firstOption : variants.get(0).getOptions()) {
            for (VariantOption secondOption : variants.get(1).getOptions()) {
                keys.add(orderedCombinationKey(List.of(firstOption.getId(), secondOption.getId())));
            }
        }
        return keys;
    }

    private void setSelectedVariants(Product product, List<Variant> variants) {
        product.getVariants().clear();
        product.getVariants().addAll(variants);
    }

    private void replaceSelectedVariants(Product product, List<Variant> variants) {
        List<String> currentVariantIds = product.getVariants().stream().map(Variant::getId).toList();
        List<String> requestedVariantIds = variants.stream().map(Variant::getId).toList();
        if (currentVariantIds.equals(requestedVariantIds)) {
            return;
        }

        // Flush the removal before inserting the new ordered rows so MySQL's
        // unique (product_id, variant_order) constraint cannot collide on reorder.
        product.getVariants().clear();
        productRepository.saveAndFlush(product);
        product.getVariants().addAll(variants);
    }

    private List<ProductVariantCombination> replaceCombinations(
            Product product,
            List<Variant> selectedVariants,
            List<ProductVariantCombinationRequest> requestedCombinations) {
        List<ProductVariantCombinationRequest> rows = selectedVariants.isEmpty() || requestedCombinations == null
                ? List.of()
                : requestedCombinations;
        List<ProductVariantCombination> existing = combinationRepository
                .findAllWithOptionsByProductId(product.getId());
        Map<String, ProductVariantCombination> existingById = existing.stream()
                .collect(Collectors.toMap(ProductVariantCombination::getId, Function.identity()));
        Map<String, ProductVariantCombination> existingByOptions = existing.stream()
                .collect(Collectors.toMap(
                        this::canonicalCombinationKey,
                        Function.identity(),
                        (first, second) -> {
                            throw new IllegalStateException("Product contains duplicate variant combinations");
                        }));

        List<Map<String, VariantOption>> optionsByVariant = selectedVariants.stream()
                .map(variant -> variant.getOptions().stream()
                        .collect(Collectors.toMap(VariantOption::getId, Function.identity())))
                .toList();
        Set<String> retainedIds = new HashSet<>();
        List<ProductVariantCombination> combinations = new ArrayList<>();

        for (ProductVariantCombinationRequest row : rows) {
            List<String> optionIds = normalizeIds(row.getVariantOptionIds());
            String rowId = row.getId();
            String canonicalKey = canonicalCombinationKey(optionIds);
            ProductVariantCombination combination;

            if (rowId != null) {
                combination = existingById.get(rowId);
                if (combination == null) {
                    throw new IllegalArgumentException("Combination does not belong to this product");
                }
                if (!canonicalCombinationKey(combination).equals(canonicalKey)) {
                    throw new IllegalArgumentException("Combination ID does not match its variant options");
                }
            } else {
                combination = existingByOptions.getOrDefault(canonicalKey, new ProductVariantCombination());
            }

            combination.setProduct(product);
            combination.setSku(row.getSku().trim());
            combination.setPrice(row.getPrice());
            combination.setVariantValue1(optionsByVariant.get(0).get(optionIds.get(0)));
            combination.setVariantValue2(selectedVariants.size() == 2
                    ? optionsByVariant.get(1).get(optionIds.get(1))
                    : null);
            if (combination.getId() != null) {
                retainedIds.add(combination.getId());
            }
            combinations.add(combination);
        }

        List<ProductVariantCombination> removed = existing.stream()
                .filter(combination -> !retainedIds.contains(combination.getId()))
                .toList();
        if (!removed.isEmpty()) {
            combinationRepository.deleteAll(removed);
            combinationRepository.flush();
        }
        if (combinations.isEmpty()) {
            return List.of();
        }
        return combinationRepository.saveAllAndFlush(combinations);
    }

    private ProductResponse toResponse(Product product) {
        List<Variant> selectedVariants = List.copyOf(product.getVariants());
        List<ProductVariantCombination> combinations = combinationRepository
                .findAllWithOptionsByProductId(product.getId());
        return toResponse(product, selectedVariants, combinations);
    }

    private ProductResponse toResponse(
            Product product,
            List<Variant> selectedVariants,
            List<ProductVariantCombination> combinations) {
        List<VariantResponse> variants = selectedVariants.stream()
                .map(variantMapper::toResponse)
                .toList();
        List<ProductVariantCombinationResponse> combinationResponses = combinations
                .stream()
                .sorted(combinationComparator(selectedVariants))
                .map(combination -> new ProductVariantCombinationResponse(
                        combination.getId(),
                        combination.getSku(),
                        combination.getPrice(),
                        toOptionResponses(combination, selectedVariants)))
                .toList();

        return productMapper.toResponse(product, variants, combinationResponses);
    }

    private List<VariantResponse.VariantOptionResponse> toOptionResponses(
            ProductVariantCombination combination,
            List<Variant> selectedVariants) {
        Map<String, VariantOption> optionsByVariantId = combinationOptions(combination).stream()
                .collect(Collectors.toMap(option -> option.getVariant().getId(), Function.identity()));
        return selectedVariants.stream()
                .map(variant -> optionsByVariantId.get(variant.getId()))
                .filter(java.util.Objects::nonNull)
                .map(option -> new VariantResponse.VariantOptionResponse(option.getId(), option.getValue()))
                .toList();
    }

    private Comparator<ProductVariantCombination> combinationComparator(List<Variant> variants) {
        if (variants.isEmpty()) {
            return Comparator.comparing(ProductVariantCombination::getId);
        }

        List<Map<String, Integer>> optionPositions = variants.stream()
                .map(variant -> {
                    Map<String, Integer> positions = new LinkedHashMap<>();
                    for (int index = 0; index < variant.getOptions().size(); index++) {
                        positions.put(variant.getOptions().get(index).getId(), index);
                    }
                    return positions;
                })
                .toList();
        Comparator<ProductVariantCombination> comparator = Comparator.comparingInt(
                combination -> optionPosition(combination, variants.get(0).getId(), optionPositions.get(0)));
        if (variants.size() == 2) {
            comparator = comparator.thenComparingInt(
                    combination -> optionPosition(combination, variants.get(1).getId(), optionPositions.get(1)));
        }
        return comparator.thenComparing(
                ProductVariantCombination::getId,
                Comparator.nullsLast(Comparator.naturalOrder()));
    }

    private int optionPosition(
            ProductVariantCombination combination,
            String variantId,
            Map<String, Integer> positions) {
        return combinationOptions(combination).stream()
                .filter(option -> option.getVariant().getId().equals(variantId))
                .findFirst()
                .map(option -> positions.getOrDefault(option.getId(), Integer.MAX_VALUE))
                .orElse(Integer.MAX_VALUE);
    }

    private List<VariantOption> combinationOptions(ProductVariantCombination combination) {
        List<VariantOption> options = new ArrayList<>();
        options.add(combination.getVariantValue1());
        if (combination.getVariantValue2() != null) {
            options.add(combination.getVariantValue2());
        }
        return options;
    }

    private String canonicalCombinationKey(ProductVariantCombination combination) {
        return canonicalCombinationKey(combinationOptions(combination).stream()
                .map(VariantOption::getId)
                .toList());
    }

    private String canonicalCombinationKey(List<String> optionIds) {
        return optionIds.stream().sorted().collect(Collectors.joining(COMBINATION_KEY_SEPARATOR));
    }

    private String orderedCombinationKey(List<String> optionIds) {
        return String.join(COMBINATION_KEY_SEPARATOR, optionIds);
    }

    private List<String> normalizeIds(List<String> ids) {
        if (ids == null) {
            return List.of();
        }
        return ids.stream()
                .map(id -> id == null ? "" : id.trim())
                .toList();
    }
}
