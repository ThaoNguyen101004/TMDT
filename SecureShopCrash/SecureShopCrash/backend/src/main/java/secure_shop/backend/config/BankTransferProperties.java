package secure_shop.backend.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.bank")
public class BankTransferProperties {
    /** Mã BIN ngân hàng (VD: 970422 = MB, 970436 = Vietcombank) */
    private String bin = "970422";
    private String accountNumber = "";
    private String accountName = "";
    private String bankName = "Ngân hàng";
    /** compact | compact2 | qr_only | print */
    private String qrTemplate = "compact2";
}
