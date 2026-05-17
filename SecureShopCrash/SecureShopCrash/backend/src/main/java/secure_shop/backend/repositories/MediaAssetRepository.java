package secure_shop.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import secure_shop.backend.entities.MediaAsset;

import java.util.List;
import java.util.UUID;

@Repository
public interface MediaAssetRepository extends JpaRepository<MediaAsset, Long> {
    List<MediaAsset> findByProduct_Id(UUID productId);

    void deleteByProduct_Id(UUID productId);

    boolean existsById(Long id);

    void deleteById(Long id);
}
