package secure_shop.backend.dto.user;

import lombok.Data;

@Data
public class UpdateUserProfileRequest {
    private String name;
    private String phone;
    private String avatarUrl;
}
