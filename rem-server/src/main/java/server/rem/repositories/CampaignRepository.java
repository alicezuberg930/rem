package server.rem.repositories;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import server.rem.entities.Campaign;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, String>, JpaSpecificationExecutor<Campaign> {
    @Override
    /**
     * Returns a paginated list of campaigns matching a dynamic filter.
     *
     * @param spec campaign filter
     * @param pageable paging request
     * @return campaigns page with template graph loaded
     */
    @EntityGraph(attributePaths = "template")
    Page<Campaign> findAll(Specification<Campaign> spec, Pageable pageable);

    /**
     * Loads one campaign by id scoped to business, including template and contacts with tags.
     *
     * @param id campaign id
     * @param businessId owning business id
     * @return matching campaign with template/contact/tag graph, if found
     */
    @EntityGraph(attributePaths = { "template", "contacts", "contacts.tag" })
    Optional<Campaign> findByIdAndBusinessId(String id, String businessId);

    /**
     * Bulk-loads campaigns by ids and includes contact/tag graph data.
     *
     * @param ids campaign ids
     * @return distinct campaign list with contacts and tags initialized
     */
    @EntityGraph(attributePaths = { "contacts", "contacts.tag" })
    @Query("SELECT DISTINCT campaign FROM Campaign campaign WHERE campaign.id IN :ids")
    List<Campaign> findAllWithContactsByIdIn(@Param("ids") Collection<String> ids);

    /**
     * Fetches campaigns scheduled and pending at or before a given time.
     *
     * @param now reference timestamp
     * @return due campaigns ready for processing
     */
    @Query("""
            SELECT c FROM Campaign c
            WHERE c.sendType = 'SCHEDULED'
            AND c.status = 'PENDING'
            AND c.scheduleAt <= :now
            """)
    List<Campaign> findDueCampaigns(@Param("now") LocalDateTime now);

    /**
     * Loads a campaign by id including contacts and template.
     *
     * @param id campaign id
     * @return campaign with contacts and template graph if found
     */
    @EntityGraph(attributePaths = { "contacts", "template" })
    @Query("SELECT c FROM Campaign c WHERE c.id = :id")
    Optional<Campaign> findByIdWithContactsAndTemplate(@Param("id") String id);

    /**
     * Loads a page of campaigns under one business for exports.
     *
     * @param businessId owning business id
     * @param pageable paging request
     * @return campaign slice with business and template pre-fetched
     */
    @EntityGraph(attributePaths = {"business", "template"})
    Slice<Campaign> findByBusinessId(String businessId, Pageable pageable);
}
