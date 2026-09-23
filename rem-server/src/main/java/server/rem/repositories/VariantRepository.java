package server.rem.repositories;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import server.rem.entities.Variant;

public interface VariantRepository extends JpaRepository<Variant, String>, JpaSpecificationExecutor<Variant> {
    @EntityGraph(attributePaths = "options")
    Optional<Variant> findByIdAndBusinessId(String id, String businessId);

    @EntityGraph(attributePaths = "options")
    Optional<Variant> findByBusinessIdAndNameIgnoreCase(String businessId, String name);

    @EntityGraph(attributePaths = "options")
    @Query("SELECT DISTINCT variant FROM Variant variant WHERE variant.id IN :ids")
    List<Variant> findAllWithOptionsByIdIn(@Param("ids") Collection<String> ids);

    boolean existsByBusinessIdAndNameIgnoreCase(String businessId, String name);

    boolean existsByBusinessIdAndNameIgnoreCaseAndIdNot(String businessId, String name, String id);
}
