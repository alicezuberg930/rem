package server.rem.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import server.rem.entities.Allowance;
import server.rem.entities.Business;
import server.rem.entities.User;

public interface AllowanceRepository extends JpaRepository<Allowance, String>, JpaSpecificationExecutor<Allowance> {
    List<Allowance> findByBusinessAndIsActive(Business business, User user, boolean b);
}