package secure_shop.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import secure_shop.backend.dto.product.*;
import secure_shop.backend.entities.*;
import secure_shop.backend.exception.ResourceNotFoundException;
import secure_shop.backend.mapper.ProductMapper;
import secure_shop.backend.repositories.*;
import secure_shop.backend.service.ProductService;
import secure_shop.backend.utils.ExcelHelper;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.document.Document;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {

    @Autowired(required = false)
    private VectorStore vectorStore;

    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;
    private final InventoryRepository inventoryRepository;
    private final secure_shop.backend.repositories.UserRepository userRepository;
    private final secure_shop.backend.service.EmailService emailService;
    @Override
    public Page<ProductSummaryDTO> filterProducts(Boolean active,
                                                  Long categoryId,
                                                  Long brandId,
                                                  BigDecimal minPrice,
                                                  BigDecimal maxPrice,
                                                  Boolean inStock,
                                                  String keyword,
                                                  Pageable pageable) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            if (vectorStore != null) {
                try {
                    // Lớp AI (Ưu tiên): Semantic Search
                    List<Document> docs = vectorStore.similaritySearch(
                            SearchRequest.builder().query(keyword).topK(50).build()
                    );
                    
                    if (!docs.isEmpty()) {
                        List<UUID> productIds = docs.stream()
                                .map(d -> d.getMetadata().get("id"))
                                .filter(id -> id != null)
                                .map(id -> UUID.fromString(id.toString()))
                                .collect(Collectors.toList());
                                
                        if (!productIds.isEmpty()) {
                            // Lọc thêm bằng các criteria của user (Active, Category, v.v...)
                            return productRepository.filterProductsByIds(
                                    active, categoryId, brandId, minPrice, maxPrice, inStock, productIds, pageable);
                        }
                    }
                } catch (Exception e) {
                    // Lớp SQL (Dự phòng): Bắt lỗi AI API (ví dụ timeout, hết quota) và fallback
                    log.error("AI Search failed for keyword '{}'. Fallback to SQL LIKE search. Error: {}", keyword, e.getMessage());
                }
            }
        }
        
        // SQL Fallback (hoặc khi không có keyword)
        return productRepository
                .filterProducts(active, categoryId, brandId, minPrice, maxPrice, inStock, keyword, pageable);
    }

    @Override
    public ProductDTO getProductById(UUID id) {
        Product product = productRepository.findProductById(id);
        if (product == null) {
            throw new ResourceNotFoundException("Product", id);
        }
        return productMapper.toProductDTO(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDetailsDTO getProductDetailsById(UUID id) {
        return productRepository.findByIdWithRelations(id)
                .map(productMapper::toProductDetailsDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
    }

    @Override
    @Transactional
    public ProductDTO createProduct(ProductDetailsDTO dto) {
        Product product = productMapper.toEntity(dto);
        product.setDeletedAt(null); // đảm bảo không gán nhầm
        product.setActive(true);

        var saved = productRepository.save(product);

        Inventory inventory = new Inventory();
        inventory.setProduct(saved);
        inventory.setOnHand(dto.getAvailableStock() != null ? dto.getAvailableStock() : 0);
        inventory.setReserved(0);
        inventoryRepository.save(inventory);

        if (dto.getMediaAssets() != null && !dto.getMediaAssets().isEmpty()) {
            List<MediaAsset> mediaAssets = dto.getMediaAssets().stream()
                    .map(mediaDTO -> {
                        MediaAsset media = new MediaAsset();
                        media.setUrl(mediaDTO.getUrl());
                        media.setAltText(mediaDTO.getAltText());
                        media.setProduct(product);
                        return media;
                    })
                    .collect(Collectors.toList());
            product.setMediaAssets(mediaAssets);
        }

        // Trigger Flash Sale Alert email if product is active and has discount
        if (saved.getActive() && saved.getListedPrice() != null && saved.getPrice() != null 
                && saved.getListedPrice().compareTo(BigDecimal.ZERO) > 0 
                && saved.getPrice().compareTo(saved.getListedPrice()) < 0) {
            try {
                java.util.List<secure_shop.backend.entities.User> customers = userRepository.findByEnabledTrueAndRoleAndDeletedAtIsNull(secure_shop.backend.enums.Role.USER);
                emailService.sendFlashSaleAlert(saved, customers);
            } catch (Exception e) {
                // Prevent transaction rollback if email sending fails
            }
        }

        return productMapper.toProductDTO(saved);
    }

    @Override
    @Transactional
    public ProductDTO updateProduct(UUID id, ProductDetailsDTO dto) {
        Product existing = productRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));

        // Nếu sản phẩm đã bị xóa mềm → không cho cập nhật
        if (existing.getDeletedAt() != null) {
            throw new IllegalStateException("Cannot update a deleted product");
        }

        boolean wasFlashSale = existing.getActive() 
                && existing.getListedPrice() != null 
                && existing.getPrice() != null 
                && existing.getListedPrice().compareTo(BigDecimal.ZERO) > 0 
                && existing.getPrice().compareTo(existing.getListedPrice()) < 0;

        existing.setSku(dto.getSku());
        existing.setName(dto.getName());
        existing.setListedPrice(dto.getListedPrice());
        if (dto.getPrice() != null) {
            existing.setPrice(dto.getPrice());
        }
        existing.setActive(dto.getActive());
        existing.setShortDesc(dto.getShortDesc());
        existing.setLongDesc(dto.getLongDesc());
        existing.setThumbnailUrl(dto.getThumbnailUrl());

        // Update brand
        if (dto.getBrand() != null && dto.getBrand().getId() != null) {
            Brand brand = brandRepository.findById(dto.getBrand().getId());
            if (brand == null) {
                throw new ResourceNotFoundException("Brand", dto.getBrand().getId());
            }
            existing.setBrand(brand);
        } else {
            existing.setBrand(null);
        }

        // Update category
        if (dto.getCategory() != null && dto.getCategory().getId() != null) {
            Category category = categoryRepository.findById(dto.getCategory().getId());
            if (category == null) {
                throw new ResourceNotFoundException("Category", dto.getCategory().getId());
            }
            existing.setCategory(category);
        } else {
            existing.setCategory(null);
        }

        syncMediaAssets(existing, dto);

        var updated = productRepository.save(existing);

        boolean isFlashSale = updated.getActive() 
                && updated.getListedPrice() != null 
                && updated.getPrice() != null 
                && updated.getListedPrice().compareTo(BigDecimal.ZERO) > 0 
                && updated.getPrice().compareTo(updated.getListedPrice()) < 0;

        if (isFlashSale && !wasFlashSale) {
            try {
                java.util.List<secure_shop.backend.entities.User> customers = userRepository.findByEnabledTrueAndRoleAndDeletedAtIsNull(secure_shop.backend.enums.Role.USER);
                emailService.sendFlashSaleAlert(updated, customers);
            } catch (Exception e) {
                // Prevent transaction rollback if email sending fails
            }
        }

        return productMapper.toProductDTO(updated);
    }

    // Soft delete
    @Override
    @Transactional
    public Boolean deleteProduct(UUID id) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isEmpty()) {
            return false;
        }

        Product product = productOpt.get();

        if (product.getDeletedAt() != null) {
            return false;
        }

        productRepository.delete(product);
        return true;
    }

    @Transactional
    public ProductDTO restoreProduct(UUID id) {
        Product product = productRepository.findDeletedById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deleted Product", id));

        product.setDeletedAt(null);
        product.setActive(true);
        productRepository.save(product);

        return productMapper.toProductDTO(product);
    }

    @Override
    public Boolean existsById(UUID id) {
        return productRepository.existsById(id);
    }

    @Override
    public Integer getTotalProductsCount() {
        return productRepository.countProductsNotDeleted();
    }

    /**
     * Must mutate the existing collection in-place — replacing the list breaks Hibernate orphanRemoval.
     */
    private void syncMediaAssets(Product existing, ProductDetailsDTO dto) {
        if (existing.getMediaAssets() == null) {
            existing.setMediaAssets(new ArrayList<>());
        }
        existing.getMediaAssets().clear();

        if (dto.getMediaAssets() == null) {
            return;
        }

        dto.getMediaAssets().stream()
                .filter(mediaDTO -> mediaDTO.getUrl() != null && !mediaDTO.getUrl().isBlank())
                .forEach(mediaDTO -> {
                    MediaAsset media = new MediaAsset();
                    media.setUrl(mediaDTO.getUrl().trim());
                    media.setAltText(mediaDTO.getAltText());
                    media.setProduct(existing);
                    existing.getMediaAssets().add(media);
                });
    }

    @Override
    @Transactional
    public List<ProductDTO> importProductsFromExcel(MultipartFile file) {
        try {
            List<ProductDetailsDTO> dtos = ExcelHelper.excelToProducts(file.getInputStream());
            List<ProductDTO> savedProducts = new ArrayList<>();
            for (ProductDetailsDTO dto : dtos) {
                // Ignore if SKU already exists
                if (productRepository.findBySku(dto.getSku()).isPresent()) {
                    continue;
                }
                savedProducts.add(this.createProduct(dto));
            }
            return savedProducts;
        } catch (Exception e) {
            throw new RuntimeException("fail to store excel data: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void applyGlobalDiscount(int percent, Long categoryId) {
        if (percent < 0 || percent > 100) {
            throw new IllegalArgumentException("Percent must be between 0 and 100");
        }
        
        List<Product> products;
        if (categoryId != null && categoryId > 0) {
            Category category = categoryRepository.findById(categoryId);
            if (category == null) return;
            products = productRepository.findByCategory(category);
        } else {
            products = productRepository.findAll();
        }

        BigDecimal multiplier = BigDecimal.valueOf(1.0 - (percent / 100.0));
        
        for (Product product : products) {
            if (product.getListedPrice() != null && product.getActive() && product.getDeletedAt() == null) {
                BigDecimal newPrice = product.getListedPrice().multiply(multiplier)
                        .setScale(0, java.math.RoundingMode.HALF_UP);
                product.setPrice(newPrice);
                productRepository.save(product);
            }
        }
    }
}
