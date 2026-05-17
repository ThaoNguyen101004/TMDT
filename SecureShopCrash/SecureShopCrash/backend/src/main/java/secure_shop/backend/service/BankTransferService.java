package secure_shop.backend.service;

import secure_shop.backend.dto.payment.BankTransferQrDTO;

import java.util.UUID;

public interface BankTransferService {
    BankTransferQrDTO buildQrForOrder(UUID orderId, UUID userId);
}
