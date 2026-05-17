package secure_shop.backend.dto.combo;

import lombok.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComboItemRequest {
    @NotNull(message = "Product ID is required")
    private UUID productId;
    
    @Positive(message = "Quantity must be positive")
    private int quantity;
}
