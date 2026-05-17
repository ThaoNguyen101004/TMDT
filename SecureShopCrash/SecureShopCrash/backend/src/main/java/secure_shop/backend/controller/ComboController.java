package secure_shop.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import secure_shop.backend.dto.combo.ComboCreateRequest;
import secure_shop.backend.dto.combo.ComboDTO;
import secure_shop.backend.service.ComboService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/combos")
@RequiredArgsConstructor
public class ComboController {

    private final ComboService comboService;

    // Public endpoints
    @GetMapping
    public ResponseEntity<List<ComboDTO>> getActiveCombos() {
        return ResponseEntity.ok(comboService.getActiveCombos());
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ComboDTO>> getActiveCombosByProductId(@PathVariable UUID productId) {
        return ResponseEntity.ok(comboService.getActiveCombosByProductId(productId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComboDTO> getComboById(@PathVariable UUID id) {
        return ResponseEntity.ok(comboService.getComboById(id));
    }

    // Admin endpoints
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ComboDTO>> getAllCombos() {
        return ResponseEntity.ok(comboService.getAllCombos());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ComboDTO> createCombo(@Valid @RequestBody ComboCreateRequest request) {
        return ResponseEntity.ok(comboService.createCombo(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ComboDTO> updateCombo(@PathVariable UUID id, @Valid @RequestBody ComboCreateRequest request) {
        return ResponseEntity.ok(comboService.updateCombo(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCombo(@PathVariable UUID id) {
        comboService.deleteCombo(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ComboDTO> toggleActive(@PathVariable UUID id) {
        return ResponseEntity.ok(comboService.toggleActive(id));
    }
}
