package secure_shop.backend.dto.combo;

import lombok.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComboCreateRequest {
    @NotBlank(message = "Name is required")
    private String name;
    
    private String description;
    
    @NotBlank(message = "Thumbnail URL is required")
    private String thumbnailUrl;
    
    private BigDecimal fixedPrice;
    
    private Integer discountPercent;
    
    @NotNull(message = "Start time is required")
    private Instant startTime;
    
    @NotNull(message = "End time is required")
    private Instant endTime;
    
    private boolean active = true;
    
    @NotNull(message = "Combo must have items")
    private List<ComboItemRequest> items;
}
