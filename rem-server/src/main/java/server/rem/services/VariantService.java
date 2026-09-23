package server.rem.services;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import server.rem.dtos.CustomPageResponse;
import server.rem.dtos.variant.CreateVariantRequest;
import server.rem.dtos.variant.QueryVariant;
import server.rem.dtos.variant.VariantResponse;
import server.rem.entities.Business;
import server.rem.entities.Variant;
import server.rem.entities.VariantOption;
import server.rem.mappers.VariantMapper;
import server.rem.repositories.BusinessRepository;
import server.rem.repositories.VariantRepository;
import server.rem.specifications.VariantSpecification;
import server.rem.utils.exceptions.ConflictException;
import server.rem.utils.exceptions.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
public class VariantService {
    private final VariantRepository variantRepository;
    private final BusinessRepository businessRepository;
    private final VariantMapper variantMapper;

    @Transactional
    public VariantResponse create(CreateVariantRequest dto, String businessId) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found"));
        String name = dto.getName().trim();
        ensureNameAvailable(businessId, name, null);
        validateUniqueOptions(dto);

        Variant variant = variantMapper.toEntity(dto, business);
        variant.setName(name);
        dto.getOptions().forEach(optionRequest -> {
            VariantOption option = variantMapper.toOption(optionRequest, variant);
            option.setValue(optionRequest.getValue().trim());
            option.setName(option.getValue());
            variant.getOptions().add(option);
        });

        return variantMapper.toResponse(variantRepository.saveAndFlush(variant));
    }

    @Transactional
    public VariantResponse update(CreateVariantRequest dto, String id, String businessId) {
        Variant variant = findVariant(id, businessId);
        String name = dto.getName().trim();
        ensureNameAvailable(businessId, name, id);
        validateUniqueOptions(dto);

        variantMapper.updateEntity(dto, variant);
        variant.setName(name);
        synchronizeOptions(variant, dto);

        return variantMapper.toResponse(variantRepository.saveAndFlush(variant));
    }

    @Transactional
    public VariantResponse delete(String id, String businessId) {
        Variant variant = findVariant(id, businessId);
        VariantResponse response = variantMapper.toResponse(variant);
        variantRepository.delete(variant);
        return response;
    }

    @Transactional(readOnly = true)
    public VariantResponse getById(String id, String businessId) {
        return variantMapper.toResponse(findVariant(id, businessId));
    }

    @Transactional(readOnly = true)
    public CustomPageResponse<VariantResponse> getAll(QueryVariant dto, String businessId) {
        int page = Math.max(dto.getPage(), 0);
        int pageSize = Math.min(Math.max(dto.getPageSize(), 1), 10);
        Pageable pageable = PageRequest.of(page, pageSize, Sort.by(Sort.Direction.ASC, "name"));
        Specification<Variant> specification = VariantSpecification.withFilters(dto, businessId);
        Page<Variant> variants = variantRepository.findAll(specification, pageable);
        // preload options for all variants
        Map<String, Variant> variantsWithOptions = variantRepository.findAllWithOptionsByIdIn(variants.getContent()
                .stream()
                .map(Variant::getId)
                .toList())
                .stream()
                .collect(Collectors.toMap(Variant::getId, Function.identity()));
        Page<VariantResponse> response = variants
                .map(variant -> variantMapper.toResponse(variantsWithOptions.getOrDefault(variant.getId(), variant)));
        return new CustomPageResponse<>(response);
    }

    private Variant findVariant(String id, String businessId) {
        return variantRepository.findByIdAndBusinessId(id, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Variant not found"));
    }

    private void ensureNameAvailable(String businessId, String name, String currentId) {
        boolean exists = currentId == null
                ? variantRepository.existsByBusinessIdAndNameIgnoreCase(businessId, name)
                : variantRepository.existsByBusinessIdAndNameIgnoreCaseAndIdNot(businessId, name, currentId);
        if (exists) {
            throw new ConflictException("A variant with this name already exists");
        }
    }

    private void validateUniqueOptions(CreateVariantRequest dto) {
        Set<String> values = new HashSet<>();
        Set<String> ids = new HashSet<>();
        dto.getOptions().forEach(option -> {
            String normalizedValue = option.getValue().trim().toLowerCase(Locale.ROOT);
            if (!values.add(normalizedValue)) {
                throw new ConflictException("Variant option values must be unique");
            }
            if (option.getId() != null && !option.getId().isBlank() && !ids.add(option.getId())) {
                throw new ConflictException("Variant option IDs must be unique");
            }
        });
    }

    private void synchronizeOptions(Variant variant, CreateVariantRequest dto) {
        Map<String, VariantOption> existingOptions = new HashMap<>();
        variant.getOptions().forEach(option -> existingOptions.put(option.getId(), option));

        Set<String> retainedIds = new HashSet<>();
        dto.getOptions().forEach(optionRequest -> {
            String optionId = optionRequest.getId();
            String value = optionRequest.getValue().trim();
            if (optionId == null || optionId.isBlank()) {
                VariantOption option = variantMapper.toOption(optionRequest, variant);
                option.setName(value);
                option.setValue(value);
                variant.getOptions().add(option);
                return;
            }

            VariantOption option = existingOptions.get(optionId);
            if (option == null) {
                throw new IllegalArgumentException("Variant option does not belong to this variant");
            }
            option.setName(value);
            option.setValue(value);
            retainedIds.add(optionId);
        });

        variant.getOptions().removeIf(option -> option.getId() != null && !retainedIds.contains(option.getId()));
    }
}
