package server.rem.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import server.rem.entities.Business;
import server.rem.entities.Campaign;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, String>, JpaSpecificationExecutor<Campaign> {
    @EntityGraph(attributePaths = { "business" })
    @Override
    Optional<Campaign> findById(String id);

    @EntityGraph(attributePaths = { "business" })
    List<Campaign> findAllByBusiness(Business business);

    @Query("""
            SELECT c FROM Campaign c
            WHERE c.sendType = 'SCHEDULED'
            AND c.status = 'PENDING'
            AND c.scheduleAt <= :now
    """)
    List<Campaign> findDueCampaigns(@Param("now") LocalDateTime now);

    
    @Query("SELECT c FROM Campaign c LEFT JOIN FETCH c.contacts LEFT JOIN FETCH c.template WHERE c.id = :id")
    Optional<Campaign> findByIdWithContactsAndTemplate(@Param("id") String id);

    @EntityGraph(attributePaths = {"business", "template"})
    Slice<Campaign> findByBusinessId(String businessId, Pageable pageable);
}
