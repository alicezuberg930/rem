package server.rem.repositories;

import java.util.Collection;

import org.springframework.data.jpa.repository.JpaRepository;

import server.rem.entities.MediaPermission;

public interface MediaPermissionRepository extends JpaRepository<MediaPermission, String> {

    void deleteAllByMediaIdIn(Collection<String> mediaIds);
}
