import { toast } from "react-toastify";
import { api } from "./axiosConfig";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  thumbnailUrl: string;
  inStock: boolean;
  availableStock?: number;
  quantity: number;
  comboId?: string;
}

class CartService {
  private isAuthenticated(): boolean {
    return !!localStorage.getItem("accessToken");
  }

  // === Get Cart ===
  async getCart(): Promise<CartItem[]> {
    if (this.isAuthenticated()) {
      try {
        const { data } = await api.get<CartItem[]>("/cart");
        return data;
      } catch {
        return [];
      }
    } else {
      return [];
    }
  }

  // === Add Item to Cart ===
  async addToCart(
    product: {
      id: string;
      name: string;
      price: number;
      thumbnailUrl: string;
      inStock: boolean;
      availableStock?: number;
      comboId?: string;
    },
    quantity = 1
  ): Promise<boolean> {
    const maxQty = product.availableStock ?? 99;

    // Kiểm tra đăng nhập
    if (!this.isAuthenticated()) {
      toast.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return false;
    }

    // Kiểm tra sản phẩm có sẵn không
    if (!product.inStock || maxQty <= 0) {
      toast.warning("Sản phẩm hiện không có sẵn.");
      return false;
    }

    // Kiểm tra số lượng yêu cầu
    if (quantity > maxQty) {
      toast.warning(`Chỉ còn ${maxQty} sản phẩm trong kho.`);
      quantity = maxQty;
    }

    // === USER ĐÃ ĐĂNG NHẬP ===
    try {
      // Lấy cart hiện tại để kiểm tra số lượng đã có
      const currentCart = await this.getCart();
      const existing = currentCart.find((i) => 
        i.productId === product.id && i.comboId === product.comboId
      );

      const currentQty = existing ? existing.quantity : 0;
      const totalQty = currentQty + quantity;

      // Kiểm tra tổng số lượng sau khi thêm
      if (totalQty > maxQty) {
        const canAdd = maxQty - currentQty;

        if (canAdd <= 0) {
          toast.warning(
            `Bạn đã có ${currentQty} sản phẩm trong giỏ. Không thể thêm nữa!`
          );
          return false;
        }

        toast.warning(
          `Chỉ có thể thêm tối đa ${canAdd} sản phẩm nữa. Đã thêm ${canAdd} sản phẩm.`
        );
        quantity = canAdd;
      }

      await api.post("/cart/add", {
        productId: product.id,
        name: product.name,
        price: product.price,
        thumbnailUrl: product.thumbnailUrl,
        inStock: product.inStock,
        availableStock: product.availableStock,
        quantity: quantity,
        comboId: product.comboId,
      });
      
      toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
      return true;
    } catch (error: any) {
      // Xử lý lỗi từ backend
      const errorMsg =
        error.response?.data?.message ||
        "Không thể thêm sản phẩm vào giỏ hàng.";
      toast.error(errorMsg);
      return false;
    }
  }

  // === Update Quantity ===
  async updateQuantity(productId: string, quantity: number, comboId?: string): Promise<boolean> {
    if (!this.isAuthenticated()) {
      return false;
    }

    const cart = await this.getCart();
    const item = cart.find((i) => i.productId === productId && i.comboId === comboId);

    if (!item) {
      toast.error("Sản phẩm không tồn tại trong giỏ hàng.");
      return false;
    }

    const maxQty = item.availableStock ?? 99;

    // Kiểm tra vượt quá tồn kho
    if (quantity > maxQty) {
      toast.warning(`Số lượng yêu cầu vượt quá tồn kho (${maxQty}).`);
      quantity = maxQty;
    }

    // Nếu quantity <= 0 thì xóa sản phẩm
    if (quantity <= 0) {
      return this.removeItem(productId, comboId);
    }

    try {
      await api.put("/cart/update", {
        productId,
        quantity,
        comboId
      });
      return true;
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Không thể cập nhật số lượng sản phẩm.";
      toast.error(errorMsg);
      return false;
    }
  }

  // === Remove Item ===
  async removeItem(productId: string, comboId?: string): Promise<boolean> {
    if (!this.isAuthenticated()) {
      return false;
    }

    try {
      await api.post(`/cart/remove`, { productId, comboId });
      return true;
    } catch {
      toast.error("Không thể xóa sản phẩm khỏi giỏ hàng.");
      return false;
    }
  }

  // === Clear Cart ===
  async clearCart(): Promise<boolean> {
    if (!this.isAuthenticated()) {
      return false;
    }

    try {
      await api.delete("/cart/clear");
      return true;
    } catch {
      toast.error("Lỗi! Không thể xóa toàn bộ giỏ hàng.");
      return false;
    }
  }

  // === Merge Guest Cart After Login ===
  async mergeGuestCart(): Promise<void> {
    // No-op since we do not store guest cart anymore
    return;
  }

  // === Cart Count ===
  async getCartCount(): Promise<number> {
    if (!this.isAuthenticated()) {
      return 0;
    }
    const cart = await this.getCart();
    return cart.reduce((total, i) => total + i.quantity, 0);
  }
}

export const cartService = new CartService();
