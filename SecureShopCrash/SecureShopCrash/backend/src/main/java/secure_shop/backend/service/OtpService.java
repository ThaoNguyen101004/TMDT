package secure_shop.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class OtpService {
    
    // key: tempToken, value: OtpData(otp, userId)
    private final Map<String, OtpData> otpCache = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    private final Random random = new Random();

    public static class OtpData {
        public final String otp;
        public final UUID userId;
        public final String email;
        
        public OtpData(String otp, UUID userId, String email) {
            this.otp = otp;
            this.userId = userId;
            this.email = email;
        }
    }

    public String generateOtp(UUID userId, String email) {
        String otp = String.format("%06d", random.nextInt(1000000));
        // Dùng email làm key nếu có, nếu không thì dùng UUID
        String key = (email != null && !email.isBlank()) ? email : UUID.randomUUID().toString();
        
        otpCache.put(key, new OtpData(otp, userId, email));
        
        // Remove after 5 minutes
        scheduler.schedule(() -> otpCache.remove(key), 5, TimeUnit.MINUTES);
        
        return key;
    }

    public String generateOtp(UUID userId) {
        return generateOtp(userId, null);
    }

    public String getOtp(String tempToken) {
        OtpData data = otpCache.get(tempToken);
        return data != null ? data.otp : null;
    }

    public UUID verifyOtpAndGetUserId(String key, String otp) {
        OtpData data = otpCache.get(key);
        if (data != null && data.otp.equals(otp)) {
            otpCache.remove(key); // invalidate after successful use
            return data.userId;
        }
        return null;
    }
}
