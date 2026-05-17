package secure_shop.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import secure_shop.backend.dto.combo.ComboCreateRequest;
import secure_shop.backend.dto.combo.ComboDTO;
import secure_shop.backend.dto.combo.ComboItemDTO;
import secure_shop.backend.dto.product.ProductSummaryDTO;
import secure_shop.backend.entities.Combo;
import secure_shop.backend.entities.ComboItem;
import secure_shop.backend.entities.Product;
import secure_shop.backend.exception.ResourceNotFoundException;
import secure_shop.backend.repositories.ComboRepository;
import secure_shop.backend.repositories.ProductRepository;
import secure_shop.backend.service.ComboService;
import secure_shop.backend.mapper.ProductMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComboServiceImpl implements ComboService {

    private final ComboRepository comboRepository;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    @Transactional
    public ComboDTO createCombo(ComboCreateRequest request) {
        Combo combo = Combo.builder()
                .name(request.getName())
                .description(request.getDescription())
                .thumbnailUrl(request.getThumbnailUrl())
                .fixedPrice(request.getFixedPrice())
                .discountPercent(request.getDiscountPercent())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .active(request.isActive())
                .build();

        List<ComboItem> items = request.getItems().stream().map(req -> {
            Product product = productRepository.findById(req.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", req.getProductId()));
            return ComboItem.builder()
                    .combo(combo)
                    .product(product)
                    .quantity(req.getQuantity())
                    .build();
        }).collect(Collectors.toList());

        combo.setItems(items);
        Combo saved = comboRepository.save(combo);
        return mapToDTO(saved);
    }

    @Override
    @Transactional
    public ComboDTO updateCombo(UUID id, ComboCreateRequest request) {
        Combo combo = comboRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Combo", id));

        combo.setName(request.getName());
        combo.setDescription(request.getDescription());
        combo.setThumbnailUrl(request.getThumbnailUrl());
        combo.setFixedPrice(request.getFixedPrice());
        combo.setDiscountPercent(request.getDiscountPercent());
        combo.setStartTime(request.getStartTime());
        combo.setEndTime(request.getEndTime());
        combo.setActive(request.isActive());

        // Update items: clear existing and add new
        combo.getItems().clear();
        List<ComboItem> newItems = request.getItems().stream().map(req -> {
            Product product = productRepository.findById(req.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", req.getProductId()));
            return ComboItem.builder()
                    .combo(combo)
                    .product(product)
                    .quantity(req.getQuantity())
                    .build();
        }).collect(Collectors.toList());
        
        combo.getItems().addAll(newItems);
        Combo saved = comboRepository.save(combo);
        return mapToDTO(saved);
    }

    @Override
    @Transactional
    public void deleteCombo(UUID id) {
        Combo combo = comboRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Combo", id));
        comboRepository.delete(combo);
    }

    @Override
    @Transactional
    public ComboDTO toggleActive(UUID id) {
        Combo combo = comboRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Combo", id));
        combo.setActive(!combo.isActive());
        Combo saved = comboRepository.save(combo);
        return mapToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ComboDTO getComboById(UUID id) {
        Combo combo = comboRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Combo", id));
        return mapToDTO(combo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComboDTO> getAllCombos() {
        return comboRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComboDTO> getActiveCombos() {
        return comboRepository.findByActiveTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComboDTO> getActiveCombosByProductId(UUID productId) {
        return comboRepository.findActiveCombosByProductId(productId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private ComboDTO mapToDTO(Combo combo) {
        List<ComboItemDTO> itemDTOs = combo.getItems().stream().map(item -> 
            ComboItemDTO.builder()
                .id(item.getId())
                .product(productMapper.toProductSummaryDTO(item.getProduct()))
                .quantity(item.getQuantity())
                .build()
        ).collect(Collectors.toList());

        return ComboDTO.builder()
                .id(combo.getId())
                .name(combo.getName())
                .description(combo.getDescription())
                .thumbnailUrl(combo.getThumbnailUrl())
                .fixedPrice(combo.getFixedPrice())
                .discountPercent(combo.getDiscountPercent())
                .startTime(combo.getStartTime())
                .endTime(combo.getEndTime())
                .active(combo.isActive())
                .items(itemDTOs)
                .build();
    }
}
