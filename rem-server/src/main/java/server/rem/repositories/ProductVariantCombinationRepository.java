package server.rem.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import server.rem.entities.ProductVariantCombination;

public interface ProductVariantCombinationRepository extends JpaRepository<ProductVariantCombination, String> {
    @Query("""
            SELECT combination
            FROM ProductVariantCombination combination
            JOIN FETCH combination.variantValue1 variantOption1
            JOIN FETCH variantOption1.variant variant1
            LEFT JOIN FETCH combination.variantValue2 variantOption2
            LEFT JOIN FETCH variantOption2.variant variant2
            WHERE combination.product.id = :productId
            ORDER BY variantOption1.createdAt ASC, variantOption2.createdAt ASC, combination.id ASC
            """)
    List<ProductVariantCombination> findAllWithOptionsByProductId(@Param("productId") String productId);

    @Modifying(flushAutomatically = true)
    @Query("DELETE FROM ProductVariantCombination combination WHERE combination.product.id = :productId")
    void deleteAllByProductId(@Param("productId") String productId);
}
