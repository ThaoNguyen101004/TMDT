package secure_shop.backend.dto.combo;

import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComboDTO {
    private UUID id;
    private String name;
    private String description;
    private String thumbnailUrl;
    private BigDecimal fixedPrice;
    private Integer discountPercent;
    private Instant startTime;
    private Instant endTime;
    private boolean active;
    private List<ComboItemDTO> items;
}
