package secure_shop.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Description;
import secure_shop.backend.entities.User;

import secure_shop.backend.service.OrderService;
import secure_shop.backend.service.UserService;

import java.util.Optional;
import java.util.UUID;
import java.util.List;
import java.util.function.Function;

import secure_shop.backend.repositories.OrderRepository;
import secure_shop.backend.entities.Order;
import secure_shop.backend.enums.OrderStatus;

@Configuration
public class AdminAiTools {

    public record ConfirmOrderRequest(String orderId) {}

    @Bean
    @Description("Xác nhận một đơn hàng bằng mã đơn hàng (orderId). Trả về kết quả thực thi.")
    public Function<ConfirmOrderRequest, String> confirmOrderTool(OrderService orderService) {
        return request -> {
            try {
                orderService.confirmOrder(UUID.fromString(request.orderId()));
                return "Đã xác nhận đơn hàng " + request.orderId() + " thành công.";
            } catch (Exception e) {
                return "Không thể xác nhận đơn hàng " + request.orderId() + ": " + e.getMessage();
            }
        };
    }

    public record BanUserRequest(String email) {}

    @Bean
    @Description("Vô hiệu hóa (khóa) một tài khoản người dùng bằng email của họ. Trả về kết quả thực thi.")
    public Function<BanUserRequest, String> banUserTool(UserService userService) {
        return request -> {
            try {
                Optional<User> userOpt = userService.findByEmail(request.email());
                if (userOpt.isEmpty()) {
                    return "Không tìm thấy người dùng với email: " + request.email();
                }
                userService.disableUser(userOpt.get().getId());
                return "Đã khóa tài khoản " + request.email() + " thành công.";
            } catch (Exception e) {
                return "Lỗi khi khóa người dùng: " + e.getMessage();
            }
        };
    }

    public record DeleteCancelledOrdersRequest(String confirm) {}

    @Bean
    @Description("Xóa vĩnh viễn toàn bộ các đơn hàng có trạng thái CANCELLED (đã hủy) ra khỏi hệ thống.")
    public Function<DeleteCancelledOrdersRequest, String> deleteCancelledOrdersTool(OrderRepository orderRepository) {
        return request -> {
            try {
                List<Order> cancelledOrders = orderRepository.findByStatus(OrderStatus.CANCELLED);
                if (cancelledOrders.isEmpty()) {
                    return "Không có đơn hàng nào đã bị hủy trong hệ thống để xóa.";
                }
                int count = cancelledOrders.size();
                orderRepository.deleteAll(cancelledOrders);
                return "Đã xóa thành công " + count + " đơn hàng đã hủy.";
            } catch (Exception e) {
                return "Lỗi khi xóa đơn hàng đã hủy: " + e.getMessage();
            }
        };
    }
}
