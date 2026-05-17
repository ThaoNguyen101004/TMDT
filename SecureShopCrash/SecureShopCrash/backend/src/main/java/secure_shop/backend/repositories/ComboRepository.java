package secure_shop.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import secure_shop.backend.entities.Combo;

import java.util.List;
import java.util.UUID;

@Repository
public interface ComboRepository extends JpaRepository<Combo, UUID> {
    List<Combo> findByActiveTrue();

    @Query("SELECT DISTINCT c FROM Combo c JOIN c.items ci WHERE ci.product.id = :productId AND c.active = true AND c.startTime <= CURRENT_TIMESTAMP AND c.endTime >= CURRENT_TIMESTAMP")
    List<Combo> findActiveCombosByProductId(@Param("productId") UUID productId);
}
