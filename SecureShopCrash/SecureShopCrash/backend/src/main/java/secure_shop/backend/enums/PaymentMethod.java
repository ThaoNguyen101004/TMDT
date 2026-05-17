package secure_shop.backend.enums;

public enum PaymentMethod {
    COD,
    BANK_TRANSFER,
    E_WALLET // Giữ lại để tránh lỗi mapping Hibernate với các đơn hàng cũ trong Database
}
