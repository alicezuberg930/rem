package server.rem.repositories;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import server.rem.entities.Media;
import server.rem.enums.MediaStatus;
import server.rem.enums.MediaType;

public interface MediaRepository extends JpaRepository<Media, String>, JpaSpecificationExecutor<Media> {

    List<Media> findAllByIdInAndBusinessId(Collection<String> ids, String businessId);

    Optional<Media> findFirstByIdAndBusinessIdAndTypeAndStatus(
            String id,
            String businessId,
            MediaType type,
            MediaStatus status);

    Optional<Media> findFirstByIdAndBusinessIdAndStatus(
            String id,
            String businessId,
            MediaStatus status);

    Optional<Media> findFirstByBusinessIdAndParentIsNullAndNameAndTypeAndStatus(
            String businessId,
            String name,
            MediaType type,
            MediaStatus status);

    Optional<Media> findFirstByBusinessIdAndParentIdAndNameAndTypeAndStatus(
            String businessId,
            String parentId,
            String name,
            MediaType type,
            MediaStatus status);
}
