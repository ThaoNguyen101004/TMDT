package secure_shop.backend.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import secure_shop.backend.dto.chat.ChatRequest;
import secure_shop.backend.dto.chat.ChatResponse;
import secure_shop.backend.entities.Product;
import secure_shop.backend.repositories.ProductRepository;
import secure_shop.backend.service.ChatService;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatServiceImpl implements ChatService {

    private final ProductRepository productRepository;
    @Autowired(required = false)
    private VectorStore vectorStore; // optional RAG
    @Autowired(required = false)
    private ChatClient chatClient; // optional - if OpenAI key not set, heuristic only
    @Autowired(required = false)
    private ChatMemory chatMemory;

    @Override
    public ChatResponse chat(ChatRequest request) {
        String userMsg = request.getMessage().trim();
        List<Product> topProducts = productRepository.findTop5ByActiveTrueOrderByReviewCountDesc();

        List<ChatResponse.ProductSuggestion> suggestions = topProducts.stream().map(p -> ChatResponse.ProductSuggestion.builder()
                .id(p.getId().toString())
                .name(p.getName())
                .sku(p.getSku())
                .rating(p.getRating())
                .reviewCount(p.getReviewCount())
                .thumbnailUrl(p.getThumbnailUrl())
                .price(formatCurrency(p.getPrice()))
                .build()).collect(Collectors.toList());

        String heuristicAnswer = heuristic(userMsg, suggestions);

        // If no AI client available, use heuristic
        if (chatClient == null) {
            log.info("ChatClient is null - using heuristic answer only");
            return ChatResponse.builder()
                    .answer(heuristicAnswer)
                    .suggestions(filterSuggestions(userMsg, suggestions))
                    .build();
        }

        String systemContext = buildSystemContext(suggestions, userMsg);

        try {
            log.info("Calling OpenAI with user message: {}", userMsg);
            String aiAnswer = chatClient.prompt()
                    .system(systemContext)
                    .user(userMsg)
                    .call()
                    .content();
            log.info("OpenAI response received successfully");
            return ChatResponse.builder()
                    .answer(aiAnswer)
                    .suggestions(filterSuggestions(userMsg, suggestions))
                    .build();
        } catch (Exception ex) {
            log.error("AI call failed, fallback heuristic", ex);
            return ChatResponse.builder()
                    .answer(heuristicAnswer)
                    .suggestions(filterSuggestions(userMsg, suggestions))
                    .build();
        }
    }

    private String buildSystemContext(List<ChatResponse.ProductSuggestion> suggestions, String userMsg) {
        String productLines = suggestions.stream()
                .map(s -> String.format("- %s (ID: %s, %s, rating %.1f, %d reviews)",
                        s.getName(), s.getId(), s.getPrice(), s.getRating(), s.getReviewCount()))
                .collect(Collectors.joining("\n"));

        StringBuilder ragContext = new StringBuilder();
        
        if (vectorStore != null) {
            try {
                List<Document> docs = vectorStore.similaritySearch(
                        SearchRequest.builder()
                                .query(userMsg)
                                .topK(5)
                                .build()
                );
                if (!docs.isEmpty()) {
                    ragContext.append("\nNội dung tham chiếu:\n");
                    for (Document d : docs) {
                        // Document is a record in Spring AI 1.x - access text via getText()
                        String text = d.getText();
                        ragContext.append("- ").append(text != null ? text : d.toString()).append("\n");
                    }
                }
            } catch (Exception e) {
                log.debug("Vector search failed: {}", e.getMessage());
            }
        }

        return "Bạn là trợ lý tư vấn khách hàng chuyên nghiệp của cửa hàng mỹ phẩm Lumière Beauty. Giao tiếp thân thiện, ngắn gọn, xưng là 'Lumi' hoặc 'mình'. Không bịa đặt thông tin ngoài ngữ cảnh.\n" +
                "Danh sách sản phẩm trong ngữ cảnh (các sản phẩm này sẽ được hệ thống tự động hiển thị thành Thẻ Sản phẩm có ảnh cho khách):\n" + productLines + ragContext +
                "\nQUAN TRỌNG: Giao diện đã tự động hiển thị các Thẻ Sản phẩm ở dưới cùng. Bạn KHÔNG CẦN phải liệt kê lại tên, giá, rating hay tạo link thủ công nữa. Chỉ cần nói một câu dẫn dắt ngắn gọn (ví dụ: 'Dưới đây là các sản phẩm phù hợp với bạn:') hoặc trả lời trực tiếp câu hỏi của khách hàng.";
    }

    @Override
    public Flux<String> streamChat(String chatId, String message) {
        String userMsg = message.trim();
        List<Product> topProducts = productRepository.findTop5ByActiveTrueOrderByReviewCountDesc();

        List<ChatResponse.ProductSuggestion> suggestions = topProducts.stream().map(p -> ChatResponse.ProductSuggestion.builder()
                .id(p.getId().toString())
                .name(p.getName())
                .sku(p.getSku())
                .rating(p.getRating())
                .reviewCount(p.getReviewCount())
                .thumbnailUrl(p.getThumbnailUrl())
                .price(formatCurrency(p.getPrice()))
                .build()).collect(Collectors.toList());

        if (chatClient == null) {
            try {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                String suggestionsJson = mapper.writeValueAsString(filterSuggestions(userMsg, suggestions));
                String metadataPrefix = "___SUGGESTIONS___" + suggestionsJson + "___END_SUGGESTIONS___";
                return Flux.just(metadataPrefix + heuristic(userMsg, suggestions));
            } catch (Exception e) {
                return Flux.just(heuristic(userMsg, suggestions));
            }
        }

        String systemContext = buildSystemContext(suggestions, userMsg);

        try {
            var promptBuilder = chatClient.prompt()
                    .system(systemContext)
                    .user(userMsg);
                    
            if (chatMemory != null && chatId != null && !chatId.isEmpty()) {
                promptBuilder = promptBuilder.advisors(MessageChatMemoryAdvisor.builder(chatMemory).conversationId(chatId).build());
            }
            
            
            Flux<String> aiStream = promptBuilder.stream().content();
            try {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                String suggestionsJson = mapper.writeValueAsString(filterSuggestions(userMsg, suggestions));
                String metadataPrefix = "___SUGGESTIONS___" + suggestionsJson + "___END_SUGGESTIONS___";
                return Flux.concat(Flux.just(metadataPrefix), aiStream);
            } catch (Exception e) {
                return aiStream;
            }
        } catch (Exception ex) {
            log.error("AI stream call failed, fallback heuristic", ex);
            try {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                String suggestionsJson = mapper.writeValueAsString(filterSuggestions(userMsg, suggestions));
                String metadataPrefix = "___SUGGESTIONS___" + suggestionsJson + "___END_SUGGESTIONS___";
                return Flux.just(metadataPrefix + heuristic(userMsg, suggestions));
            } catch (Exception e) {
                return Flux.just(heuristic(userMsg, suggestions));
            }
        }
    }

    private String heuristic(String msg, List<ChatResponse.ProductSuggestion> suggestions) {
        String lower = msg.toLowerCase(Locale.ROOT);
        if (lower.contains("chính sách")) {
            return "Chính sách: Giao hàng 2-5 ngày làm việc, miễn phí đổi trả trong 7 ngày nếu sản phẩm còn nguyên vẹn, bảo hành chính hãng (thời gian tùy dòng sản phẩm).";
        }
        if (lower.contains("đặt hàng") || lower.contains("cách đặt")) {
            return "Cách đặt hàng: 1) Chọn sản phẩm và thêm vào giỏ. 2) Vào giỏ kiểm tra số lượng. 3) Nhấn Thanh toán, nhập địa chỉ và chọn phương thức thanh toán. 4) Xác nhận đơn hàng. Bạn sẽ nhận email xác nhận.";
        }
        if (lower.contains("bán chạy") || lower.contains("phổ biến") || lower.contains("top")) {
            return "Các sản phẩm được nhiều đánh giá: " + suggestions.stream().map(ChatResponse.ProductSuggestion::getName).collect(Collectors.joining(", ")) + ".";
        }
        if (lower.contains("phù hợp") || lower.contains("nên mua")) {
            return "Bạn có thể cho biết ngân sách hoặc nhu cầu (ví dụ: chơi game, văn phòng, gia dụng)? Tạm thời gợi ý: " + suggestions.stream().limit(3).map(ChatResponse.ProductSuggestion::getName).collect(Collectors.joining(", ")) + ".";
        }
        return "Tôi có thể hỗ trợ về sản phẩm, chính sách, cách đặt hàng. Bạn muốn hỏi cụ thể điều gì?";
    }

    private List<ChatResponse.ProductSuggestion> filterSuggestions(String userMsg, List<ChatResponse.ProductSuggestion> all) {
        String lower = userMsg.toLowerCase(Locale.ROOT);
        
        if (lower.contains("nước hoa") || lower.contains("thơm") || lower.contains("parfum") || lower.contains("chanel") || lower.contains("dior")) {
            return all.stream()
                .filter(p -> p.getName().toLowerCase().contains("parfum") || p.getName().toLowerCase().contains("dior") || p.getName().toLowerCase().contains("chanel"))
                .collect(Collectors.toList());
        }
        if (lower.contains("kem mắt") || lower.contains("eye") || lower.contains("mắt") || lower.contains("estée lauder")) {
            return all.stream()
                .filter(p -> p.getName().toLowerCase().contains("eye") || p.getName().toLowerCase().contains("mắt") || p.getName().toLowerCase().contains("estee"))
                .collect(Collectors.toList());
        }
        if (lower.contains("nền") || lower.contains("foundation") || lower.contains("trang điểm") || lower.contains("mac")) {
            return all.stream()
                .filter(p -> p.getName().toLowerCase().contains("foundation") || p.getName().toLowerCase().contains("nền") || p.getName().toLowerCase().contains("mac"))
                .collect(Collectors.toList());
        }
        
        if (lower.contains("bán chạy") || lower.contains("phổ biến") || lower.contains("top") || lower.contains("phù hợp") || lower.contains("sản phẩm")) {
            return all;
        }
        
        return new ArrayList<>();
    }

    private String formatCurrency(BigDecimal amount) {
        if (amount == null) return "0₫";
        NumberFormat nf = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
        return nf.format(amount);
    }
}
