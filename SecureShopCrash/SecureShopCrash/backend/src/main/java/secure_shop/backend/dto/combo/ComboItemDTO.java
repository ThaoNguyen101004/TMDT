package secure_shop.backend.dto.combo;

import lombok.*;
import secure_shop.backend.dto.product.ProductSummaryDTO;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComboItemDTO {
    private UUID id;
    private ProductSummaryDTO product;
    private int quantity;
}
