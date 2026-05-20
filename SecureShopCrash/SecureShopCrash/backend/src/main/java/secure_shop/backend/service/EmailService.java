package secure_shop.backend.service;

import jakarta.mail.MessagingException;
import java.io.IOException;
import secure_shop.backend.entities.Order;

public interface EmailService {
    void sendResetPasswordEmail(String to, String resetLink) throws MessagingException, IOException;
    void sendVerificationEmail(String to, String verificationLink) throws MessagingException, IOException;
    void sendOrderConfirmationEmail(Order order) throws MessagingException, IOException;
    void sendOtpEmail(String to, String otp) throws MessagingException, IOException;
    void sendNewComboAlert(secure_shop.backend.entities.Combo combo, java.util.List<secure_shop.backend.entities.User> customers);
    void sendFlashSaleAlert(secure_shop.backend.entities.Product product, java.util.List<secure_shop.backend.entities.User> customers);
}