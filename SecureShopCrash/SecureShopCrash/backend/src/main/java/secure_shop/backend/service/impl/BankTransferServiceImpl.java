package secure_shop.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import secure_shop.backend.config.BankTransferProperties;
import secure_shop.backend.dto.payment.BankTransferQrDTO;
import secure_shop.backend.entities.Order;
import secure_shop.backend.exception.BusinessRuleViolationException;
import secure_shop.backend.exception.ResourceNotFoundException;
import secure_shop.backend.repositories.OrderRepository;
import secure_shop.backend.service.BankTransferService;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BankTransferServiceImpl implements BankTransferService {

    private final OrderRepository orderRepository;
    private final BankTransferProperties bankProps;

    @Override
    @Transactional(readOnly = true)
    public BankTransferQrDTO buildQrForOrder(UUID orderId, UUID userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));

        if (order.getUser() == null || !order.getUser().getId().equals(userId)) {
            throw new BusinessRuleViolationException("Bạn không có quyền xem thông tin thanh toán đơn này");
        }

        if (bankProps.getAccountNumber() == null || bankProps.getAccountNumber().isBlank()) {
            throw new BusinessRuleViolationException(
                    "Chưa cấu hình tài khoản ngân hàng. Vui lòng cập nhật app.bank.* trong application-secret.properties");
        }

        order.recalculateTotals();
        long amountVnd = order.getGrandTotal().longValue();
        String transferContent = buildTransferContent(orderId);

        String qrImageUrl = buildVietQrImageUrl(
                bankProps.getBin(),
                bankProps.getAccountNumber(),
                bankProps.getQrTemplate(),
                amountVnd,
                transferContent,
                bankProps.getAccountName()
        );

        return BankTransferQrDTO.builder()
                .orderId(orderId)
                .amount(order.getGrandTotal())
                .transferContent(transferContent)
                .qrImageUrl(qrImageUrl)
                .bankName(bankProps.getBankName())
                .accountNumber(bankProps.getAccountNumber())
                .accountName(bankProps.getAccountName())
                .build();
    }

    private String buildTransferContent(UUID orderId) {
        String shortId = orderId.toString().replace("-", "").substring(0, 8).toUpperCase();
        return "DH" + shortId;
    }

    /**
     * VietQR public image API — quét mã sẽ điền sẵn số tiền và nội dung chuyển khoản.
     * @see <a href="https://vietqr.io">vietqr.io</a>
     */
    static String buildVietQrImageUrl(
            String bankBin,
            String accountNumber,
            String template,
            long amountVnd,
            String addInfo,
            String accountName
    ) {
        String tpl = (template == null || template.isBlank()) ? "compact2" : template;
        String base = String.format(
                "https://img.vietqr.io/image/%s-%s-%s.png",
                bankBin.trim(),
                accountNumber.trim(),
                tpl
        );
        StringBuilder url = new StringBuilder(base);
        url.append("?amount=").append(amountVnd);
        if (addInfo != null && !addInfo.isBlank()) {
            url.append("&addInfo=").append(encode(addInfo));
        }
        if (accountName != null && !accountName.isBlank()) {
            url.append("&accountName=").append(encode(accountName));
        }
        return url.toString();
    }

    private static String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
