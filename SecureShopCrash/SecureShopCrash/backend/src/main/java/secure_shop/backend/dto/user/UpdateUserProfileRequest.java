package secure_shop.backend.dto.user;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UpdateUserProfileRequest {
    private String name;
    private String phone;
    private String avatarUrl;
    private LocalDate birthday;
    private String gender;
}
