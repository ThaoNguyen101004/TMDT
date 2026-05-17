package secure_shop.backend.entities.cart;

import lombok.*;
import java.io.Serializable;
import java.util.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartSession implements Serializable {
    private List<CartItem> items = new ArrayList<>();

    public void addItem(CartItem item) {
        Optional<CartItem> existing = items.stream()
                .filter(i -> i.getProductId().equals(item.getProductId()) && Objects.equals(i.getComboId(), item.getComboId()))
                .findFirst();

        if (existing.isPresent()) {
            CartItem found = existing.get();
            found.setQuantity(found.getQuantity() + item.getQuantity());
        } else {
            items.add(item);
        }
    }

    public void removeItem(UUID productId, UUID comboId) {
        items.removeIf(i -> i.getProductId().equals(productId) && Objects.equals(i.getComboId(), comboId));
    }

    public void updateQuantity(UUID productId, UUID comboId, int quantity) {
        items.stream()
                .filter(i -> i.getProductId().equals(productId) && Objects.equals(i.getComboId(), comboId))
                .findFirst()
                .ifPresent(i -> i.setQuantity(quantity));
    }

    public void clear() {
        items.clear();
    }
}