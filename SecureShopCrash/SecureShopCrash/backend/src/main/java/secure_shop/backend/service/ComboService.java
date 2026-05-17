package secure_shop.backend.service;

import secure_shop.backend.dto.combo.ComboCreateRequest;
import secure_shop.backend.dto.combo.ComboDTO;

import java.util.List;
import java.util.UUID;

public interface ComboService {
    ComboDTO createCombo(ComboCreateRequest request);
    ComboDTO updateCombo(UUID id, ComboCreateRequest request);
    void deleteCombo(UUID id);
    ComboDTO toggleActive(UUID id);
    ComboDTO getComboById(UUID id);
    List<ComboDTO> getAllCombos();
    List<ComboDTO> getActiveCombos();
    List<ComboDTO> getActiveCombosByProductId(UUID productId);
}
