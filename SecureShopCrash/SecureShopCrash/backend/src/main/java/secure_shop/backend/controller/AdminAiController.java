package secure_shop.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import secure_shop.backend.service.AdminAiService;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminAiController {

    private final AdminAiService adminAiService;

    @PostMapping("/ask")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> askAdminAi(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Message cannot be empty"));
        }
        
        String response = adminAiService.chat(message);
        return ResponseEntity.ok(Map.of("answer", response));
    }
}
