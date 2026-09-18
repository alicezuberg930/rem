package server.rem.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import server.rem.entities.Media;

public interface MediaRepository extends JpaRepository<Media, String> {
}
