package server.rem.repositories;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import server.rem.entities.Media;

public interface MediaRepository extends JpaRepository<Media, String> {

    List<Media> findAllByIdInAndBusinessId(Collection<String> ids, String businessId);
}
