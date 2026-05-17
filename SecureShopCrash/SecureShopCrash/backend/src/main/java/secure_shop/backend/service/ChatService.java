package secure_shop.backend.service;

import secure_shop.backend.dto.chat.ChatRequest;
import secure_shop.backend.dto.chat.ChatResponse;

import reactor.core.publisher.Flux;

public interface ChatService {
    ChatResponse chat(ChatRequest request);
    Flux<String> streamChat(String chatId, String message);
}
