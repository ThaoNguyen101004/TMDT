package secure_shop.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import secure_shop.backend.entities.ComboItem;

import java.util.UUID;

@Repository
public interface ComboItemRepository extends JpaRepository<ComboItem, UUID> {
}
