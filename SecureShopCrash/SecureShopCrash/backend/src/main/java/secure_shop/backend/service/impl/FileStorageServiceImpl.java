package secure_shop.backend.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import secure_shop.backend.service.FileStorageService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg", "image/jpg", "image/png", "image/webp"
    );

    private final com.cloudinary.Cloudinary cloudinary;

    public FileStorageServiceImpl(com.cloudinary.Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @Override
    public String storeImage(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File không được để trống");
        }
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("File vượt quá 5MB");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Chỉ chấp nhận ảnh JPEG, PNG hoặc WebP");
        }

        String safeFolder = (folder == null || folder.isBlank()) ? "general" : folder.replaceAll("[^a-zA-Z0-9/_-]", "");
        
        try {
            java.util.Map<String, Object> uploadParams = new java.util.HashMap<>();
            uploadParams.put("folder", "secureshop/" + safeFolder);
            
            // Upload the file directly to Cloudinary
            java.util.Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
            
            // Return the secure URL from Cloudinary
            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            throw new IllegalStateException("Không thể tải ảnh lên Cloudinary: " + e.getMessage(), e);
        }
    }
}
