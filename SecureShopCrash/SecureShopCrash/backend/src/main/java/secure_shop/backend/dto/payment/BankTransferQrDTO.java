package secure_shop.backend.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BankTransferQrDTO {
    private UUID orderId;
    private BigDecimal amount;
    private String transferContent;
    private String qrImageUrl;
    private String bankName;
    private String accountNumber;
    private String accountName;
}
