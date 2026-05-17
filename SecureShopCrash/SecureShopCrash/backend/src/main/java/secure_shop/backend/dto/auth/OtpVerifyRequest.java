package secure_shop.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OtpVerifyRequest {
    @NotBlank(message = "Temp token is required")
    private String tempToken;

    @NotBlank(message = "OTP is required")
    private String otp;
}
