package secure_shop.backend.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        String cloudinaryUrl = System.getenv("CLOUDINARY_URL");
        if (cloudinaryUrl != null && !cloudinaryUrl.isEmpty()) {
            return new Cloudinary(cloudinaryUrl);
        } else {
            // Fallback for local dev if CLOUDINARY_URL is not set
            // It will just initialize without config, but will throw errors when used if not properly set up later.
            // A common fallback to avoid bean creation failure:
            Map<String, String> config = new HashMap<>();
            config.put("cloud_name", "dummpy");
            config.put("api_key", "dummy");
            config.put("api_secret", "dummy");
            return new Cloudinary(config);
        }
    }
}
