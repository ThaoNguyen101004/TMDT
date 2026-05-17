package secure_shop.backend.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import secure_shop.backend.service.AdminAiService;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminAiServiceImpl implements AdminAiService {

    @Autowired(required = false)
    private ChatClient chatClient;

    @Override
    public String chat(String message) {
        if (chatClient == null) {
            return "Tính năng AI đang tạm thời bị vô hiệu hóa vì thiếu cấu hình API Key. Vui lòng thêm API Key vào file cấu hình.";
        }
        try {
            log.info("Admin AI Request: {}", message);
            String response = chatClient.prompt()
                    .system("Bạn là trợ lý AI quản trị cấp cao của trang thương mại điện tử SecureShop. Bạn có thể sử dụng các công cụ được cung cấp để thực hiện thao tác quản trị theo yêu cầu của Admin. Chỉ trả lời bằng tiếng Việt, ngắn gọn, súc tích.")
                    .user(message)
                    .toolNames("confirmOrderTool", "banUserTool", "deleteCancelledOrdersTool")
                    .call()
                    .content();
            log.info("Admin AI Response: {}", response);
            return response;
        } catch (Exception e) {
            log.error("Lỗi khi gọi Admin AI", e);
            return "Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn: " + e.getMessage();
        }
    }
}
