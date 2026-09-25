package server.rem.specifications;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import server.rem.entities.Media;
import server.rem.enums.MediaStatus;

@ExtendWith(MockitoExtension.class)
class MediaSpecificationTests {

    @Mock
    private Root<Media> root;
    @Mock
    private CriteriaQuery<?> query;
    @Mock
    private CriteriaBuilder criteriaBuilder;
    @Mock
    private Path<Object> businessPath;
    @Mock
    private Path<Object> businessIdPath;
    @Mock
    private Path<Object> statusPath;
    @Mock
    private Predicate businessPredicate;
    @Mock
    private Predicate statusPredicate;
    @Mock
    private Predicate combinedPredicate;

    @Test
    void filtersByBusinessAndStatus() {
        when(root.get("business")).thenReturn(businessPath);
        when(businessPath.get("id")).thenReturn(businessIdPath);
        when(root.get("status")).thenReturn(statusPath);
        when(criteriaBuilder.equal(businessIdPath, "business-id")).thenReturn(businessPredicate);
        when(criteriaBuilder.equal(statusPath, MediaStatus.ACTIVE)).thenReturn(statusPredicate);
        when(criteriaBuilder.and(businessPredicate, statusPredicate)).thenReturn(combinedPredicate);

        Predicate result = MediaSpecification
                .withFilters(MediaStatus.ACTIVE, "business-id")
                .toPredicate(root, query, criteriaBuilder);

        assertSame(combinedPredicate, result);
    }
}
