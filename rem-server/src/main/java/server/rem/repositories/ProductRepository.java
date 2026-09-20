package server.rem.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import server.rem.entities.Product;

public interface ProductRepository extends JpaRepository<Product, String> {
    List<Product> findAllByBusinessId(String businessId);

    Optional<Product> findByIdAndBusinessId(String id, String businessId);
}
