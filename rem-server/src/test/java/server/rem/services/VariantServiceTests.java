package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import server.rem.dtos.CustomPageResponse;
import server.rem.dtos.variant.QueryVariant;
import server.rem.dtos.variant.VariantResponse;
import server.rem.entities.Variant;
import server.rem.mappers.VariantMapper;
import server.rem.repositories.BusinessRepository;
import server.rem.repositories.VariantRepository;

@ExtendWith(MockitoExtension.class)
class VariantServiceTests {
    @Mock
    private VariantRepository variantRepository;
    @Mock
    private BusinessRepository businessRepository;
    @Mock
    private VariantMapper variantMapper;

    private VariantService variantService;

    @BeforeEach
    void setUp() {
        variantService = new VariantService(variantRepository, businessRepository, variantMapper);
    }

    @Test
    void getAllBulkLoadsOptionsBeforeMapping() {
        Variant pageVariant = variant("variant-1", "Color");
        Variant variantWithOptions = variant("variant-1", "Color");
        VariantResponse response = new VariantResponse("variant-1", "Color", List.of());
        Page<Variant> page = new PageImpl<>(List.of(pageVariant), PageRequest.of(0, 10), 1);

        when(variantRepository.findAll(
                any(Specification.class),
                any(Pageable.class)))
                .thenReturn(page);
        when(variantRepository.findAllWithOptionsByIdIn(List.of("variant-1")))
                .thenReturn(List.of(variantWithOptions));
        when(variantMapper.toResponse(variantWithOptions)).thenReturn(response);

        CustomPageResponse<VariantResponse> result = variantService.getAll(
                new QueryVariant(10, 0, null),
                "business-1");

        assertEquals(1, result.getContent().size());
        assertSame(response, result.getContent().getFirst());
        verify(variantRepository).findAllWithOptionsByIdIn(List.of("variant-1"));
        verify(variantMapper).toResponse(variantWithOptions);
    }

    @Test
    void getAllSkipsOptionQueryForEmptyPage() {
        when(variantRepository.findAll(
                any(Specification.class),
                any(Pageable.class)))
                .thenReturn(Page.empty(PageRequest.of(0, 10)));

        CustomPageResponse<VariantResponse> result = variantService.getAll(
                new QueryVariant(10, 0, null),
                "business-1");

        assertEquals(0, result.getContent().size());
        verify(variantRepository, never()).findAllWithOptionsByIdIn(any());
        verify(variantMapper, never()).toResponse(any());
    }

    private Variant variant(String id, String name) {
        Variant variant = Variant.builder().name(name).build();
        variant.setId(id);
        return variant;
    }
}
