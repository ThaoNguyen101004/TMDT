package secure_shop.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import secure_shop.backend.dto.discount.DiscountDTO;
import secure_shop.backend.dto.discount.DiscountDetailsDTO;
import secure_shop.backend.entities.Discount;
import secure_shop.backend.mapper.DiscountMapper;
import secure_shop.backend.repositories.DiscountRepository;
import secure_shop.backend.service.DiscountService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DiscountServiceImpl implements DiscountService {

    private final DiscountRepository discountRepository;
    private final DiscountMapper discountMapper;

    @Override
    @Transactional
    public DiscountDTO createDiscount(DiscountDTO discountDTO) {
        normalizeDiscountDto(discountDTO);
        Discount discount = discountMapper.toEntity(discountDTO);
        normalizeDiscountEntity(discount);
        Discount savedDiscount = discountRepository.save(discount);
        return discountMapper.toDTO(savedDiscount);
    }

    @Override
    @Transactional
    public DiscountDTO updateDiscount(UUID id, DiscountDTO discountDTO) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Discount not found with id: " + id));

        normalizeDiscountDto(discountDTO);
        discountMapper.updateEntityFromDTO(discountDTO, discount);
        normalizeDiscountEntity(discount);
        Discount updatedDiscount = discountRepository.save(discount);
        return discountMapper.toDTO(updatedDiscount);
    }

    private void normalizeDiscountDto(DiscountDTO dto) {
        if (dto.getCode() != null) {
            dto.setCode(sanitizeDiscountCode(dto.getCode()));
        }
        if (dto.getMinOrderValue() != null && dto.getMinOrderValue().signum() == 0) {
            dto.setMinOrderValue(null);
        }
    }

    private void normalizeDiscountEntity(Discount discount) {
        if (discount.getCode() != null) {
            discount.setCode(sanitizeDiscountCode(discount.getCode()));
        }
        if (discount.getPerUserLimit() != null && discount.getPerUserLimit() < 1) {
            discount.setPerUserLimit(null);
        }
        if (discount.getMaxUsage() != null && discount.getMaxUsage() < 0) {
            discount.setMaxUsage(null);
        }
        if (discount.getMinOrderValue() != null && discount.getMinOrderValue().signum() == 0) {
            discount.setMinOrderValue(null);
        }
    }

    /** Strip invalid chars so Bean Validation @Pattern always passes after save. */
    private String sanitizeDiscountCode(String code) {
        if (code == null || code.isBlank()) {
            return code;
        }
        return code
                .trim()
                .toUpperCase(java.util.Locale.ROOT)
                .replaceAll("\\s+", "_")
                .replaceAll("[^A-Z0-9_-]", "");
    }

    @Override
    @Transactional
    public void deleteDiscount(UUID id) {
        if (!discountRepository.existsById(id)) {
            throw new RuntimeException("Discount not found with id: " + id);
        }
        discountRepository.deleteById(id);
    }

    @Override
    public DiscountDTO getDiscountById(UUID id) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Discount not found with id: " + id));
        return discountMapper.toDTO(discount);
    }

    @Override
    public DiscountDetailsDTO getDiscountDetailsById(UUID id) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Discount not found with id: " + id));
        return discountMapper.toDetailsDTO(discount);
    }

    @Override
    public List<DiscountDTO> getAllDiscounts() {
        return discountRepository.findAll().stream()
                .map(discountMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Page<DiscountDTO> getDiscountsPage(Pageable pageable) {
        return discountRepository.findAll(pageable)
                .map(discountMapper::toDTO);
    }

    @Override
    public List<DiscountDTO> getActiveDiscounts() {
        return discountRepository.findAll().stream()
                .filter(Discount::getActive)
                .map(discountMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DiscountDetailsDTO applyDiscountCode(String code) {
        Discount discount = discountRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Mã giảm giá không tồn tại: " + code));

        if (!discount.getActive()) {
            throw new RuntimeException("Mã giảm giá không còn hiệu lực: " + code);
        }

        return discountMapper.toDetailsDTO(discount);
    }
}

