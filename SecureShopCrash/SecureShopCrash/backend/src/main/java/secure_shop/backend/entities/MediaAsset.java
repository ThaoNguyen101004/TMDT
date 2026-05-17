package secure_shop.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "media_assets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MediaAsset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "URL anh khong duoc de trong")
    @Size(max = 2048, message = "URL anh qua dai (toi da 2048 ky tu)")
    @Column(nullable = false, length = 2048)
    private String url;

    @Size(max = 255, message = "Van ban thay the (alt text) toi da 255 ky tu")
    private String altText;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "product_id", nullable = false)
    @NotNull(message = "Anh phai thuoc ve mot san pham")
    private Product product;
}