package secure_shop.backend.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import secure_shop.backend.entities.Order;
import secure_shop.backend.repositories.OrderRepository;
import secure_shop.backend.service.EmailService;

import java.util.UUID;

/**
 * Test controller for debugging email sending issues
 * TODO: Remove this controller in production
 */
@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
@Slf4j
public class TestEmailController {

    private final EmailService emailService;
    private final OrderRepository orderRepository;

    /**
     * Test sending order confirmation email for an existing order
     * Usage: GET /api/test/send-order-email/{orderId}
     */
    @GetMapping("/send-order-email/{orderId}")
    public ResponseEntity<String> testSendOrderEmail(@PathVariable UUID orderId) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

            if (order.getUser() == null || order.getUser().getEmail() == null) {
                return ResponseEntity.badRequest()
                        .body("Order does not have user email: " + orderId);
            }

            log.info("Test sending order confirmation email to {} for orderId={}", 
                    order.getUser().getEmail(), orderId);

            emailService.sendOrderConfirmationEmail(order);

            return ResponseEntity.ok("Email sent successfully to: " + order.getUser().getEmail());

        } catch (Exception e) {
            log.error("Failed to send test email for order: " + orderId, e);
            return ResponseEntity.internalServerError()
                    .body("Failed to send email: " + e.getMessage() + 
                          "\nCause: " + (e.getCause() != null ? e.getCause().getMessage() : "N/A"));
        }
    }
}
