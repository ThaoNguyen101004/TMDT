package secure_shop.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

@Entity
@Table(
        name = "products",
        indexes = {
                @Index(name = "idx_products_sku", columnList = "sku"),
                @Index(name = "idx_products_active", columnList = "active"),
                @Index(name = "idx_products_category", columnList = "category_id"),
                @Index(name = "idx_products_brand", columnList = "brand_id"),
                @Index(name = "idx_products_name", columnList = "name"),
                @Index(name = "idx_products_listed_price", columnList = "listed_price"),
                @Index(name = "idx_products_price", columnList = "price")
        }
)
@SQLDelete(sql = "UPDATE products SET deleted_at = now(), active = false WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product extends BaseEntity {

    @NotBlank(message = "Ma SKU khong duoc de trong")
    @Size(max = 100, message = "Ma SKU toi da 100 ky tu")
    @Pattern(
            regexp = "^[A-Za-z0-9\\-_.]+$",
            message = "Ma SKU chi duoc chua chu, so va cac ky tu '-', '_', '.'"
    )
    @Column(nullable = false, unique = true, length = 50)
    private String sku;

    @NotBlank(message = "Ten san pham khong duoc de trong")
    @Size(max = 255, message = "Ten san pham toi da 255 ky tu")
    @Column(nullable = false, length = 500)
    private String name;

    @Size(max = 500, message = "Mo ta ngan toi da 500 ky tu")
    @Column(columnDefinition = "TEXT")
    private String shortDesc;

    @Size(max = 5000, message = "Mo ta chi tiet toi da 5000 ky tu")
    @Column(columnDefinition = "TEXT")
    private String longDesc;

    @NotNull(message = "Gia niem yet khong duoc de trong")
    @DecimalMin(value = "0.0", inclusive = false, message = "Gia niem yet phai lon hon 0")
    @Digits(integer = 10, fraction = 2, message = "Gia niem yet khong hop le")
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal listedPrice;

    @NotNull(message = "Gia ban khong duoc de trong")
    @DecimalMin(value = "0.0", inclusive = false, message = "Gia ban phai lon hon 0")
    @Digits(integer = 10, fraction = 2, message = "Gia ban khong hop le")
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    @NotNull(message = "Trang thai hoat dong khong duoc de trong")
    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;

    @Size(max = 2048, message = "URL anh dai dien qua dai")
    private String thumbnailUrl;

    // Soft delete
    @Column(name = "deleted_at")
    private Instant deletedAt;

    @NotNull(message = "Diem danh gia khong duoc de trong")
    @DecimalMin(value = "0.0", inclusive = true, message = "Diem danh gia khong duoc nho hon 0")
    @DecimalMax(value = "5.0", inclusive = true, message = "Diem danh gia khong duoc lon hon 5")
    @Builder.Default
    @Column(nullable = false)
    private Double rating = 0.0;

    @NotNull(message = "So luong danh gia khong duoc de trong")
    @Min(value = 0, message = "So luong danh gia khong duoc am")
    @Builder.Default
    @Column(nullable = false)
    private Integer reviewCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Review> reviews = new HashSet<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MediaAsset> mediaAssets = new ArrayList<>();

    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Inventory inventory;

    @OneToMany(mappedBy = "product")
    @Builder.Default
    private Set<OrderItem> orderItems = new HashSet<>();

    // ===== Helper methods =====
    public void softDelete() {
        this.deletedAt = Instant.now();
        this.active = false;
    }

    public void restore() {
        this.deletedAt = null;
        this.active = true;
    }

    public boolean isDeleted() {
        return this.deletedAt != null;
    }

    // ===== Logic cap nhat rating =====
    public void updateRating(double newRating) {
        if (newRating < 0.0 || newRating > 5.0) {
            throw new IllegalArgumentException("Rating must be between 0 and 5");
        }
        int currentCount = (reviewCount == null) ? 0 : reviewCount;
        double currentRating = (rating == null) ? 0.0 : rating;
        double total = currentRating * currentCount;
        currentCount++;
        rating = (total + newRating) / currentCount;
        reviewCount = currentCount;
    }

    public void removeReview(double removedRating) {
        if (removedRating < 0.0 || removedRating > 5.0) {
            throw new IllegalArgumentException("Rating must be between 0 and 5");
        }
        if (reviewCount == null || reviewCount <= 1) {
            rating = 0.0;
            reviewCount = 0;
            return;
        }
        double total = rating * reviewCount;
        reviewCount--;
        rating = (total - removedRating) / reviewCount;
    }
}