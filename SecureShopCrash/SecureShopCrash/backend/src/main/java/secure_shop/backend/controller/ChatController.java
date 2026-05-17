package secure_shop.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import secure_shop.backend.dto.chat.ChatRequest;
import secure_shop.backend.dto.chat.ChatResponse;
import secure_shop.backend.service.ChatService;
import secure_shop.backend.service.VectorIngestionService;
import org.springframework.http.MediaType;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final VectorIngestionService ingestionService;

    @PostMapping("/ask")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ChatResponse> ask(@Valid @RequestBody ChatRequest request) {
        return ResponseEntity.ok(chatService.chat(request));
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @PreAuthorize("permitAll()")
    public Flux<String> streamChat(@RequestParam("chatId") String chatId, @RequestParam("message") String message) {
        return chatService.streamChat(chatId, message);
    }

    @PostMapping("/ingest")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> ingest() {
        ingestionService.ingestPoliciesAndTopProducts();
        return ResponseEntity.ok("Ingestion triggered");
    }

    @PostMapping("/ingestAll")
    @PreAuthorize("permitAll()")
    public ResponseEntity<String> ingestAll() {
        ingestionService.ingestAllProducts();
        return ResponseEntity.ok("All products ingestion triggered");
    }
}
