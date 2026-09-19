package server.rem.repositories;

import java.util.Collection;

import org.springframework.data.jpa.repository.JpaRepository;

import server.rem.entities.MediaShareLink;

public interface MediaShareLinkRepository extends JpaRepository<MediaShareLink, String> {

    void deleteAllByMediaIdIn(Collection<String> mediaIds);
}
