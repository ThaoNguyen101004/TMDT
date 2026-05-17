package secure_shop.backend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String accessToken;
    private long   expiresIn;
    
    private boolean requireOtp;
    private String tempToken;

    public AuthResponse(String accessToken, long expiresIn) {
        this.accessToken = accessToken;
        this.expiresIn = expiresIn;
        this.requireOtp = false;
        this.tempToken = null;
    }
}
