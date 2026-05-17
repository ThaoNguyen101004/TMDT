import { toast } from "react-toastify";
import type { ProductDetail, ProductSummary } from "../types/types";

const STORAGE_KEY = "wishlist";

export interface WishlistItem {
  id: string;
  sku?: string;
  name: string;
  listedPrice: number;
  price: number;
  thumbnailUrl: string;
  inStock: boolean;
  availableStock?: number;
  rating: number;
  reviewCount: number;
  category?: ProductSummary["category"];
  brand?: ProductSummary["brand"];
}

function readStorage(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WishlistItem[]) : [];
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

function writeStorage(items: WishlistItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("wishlistUpdated"));
}

export function productToWishlistItem(
  product: ProductSummary | ProductDetail
): WishlistItem {
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    listedPrice: product.listedPrice,
    price: product.price,
    thumbnailUrl: product.thumbnailUrl,
    inStock: product.inStock,
    availableStock: product.availableStock,
    rating: product.rating,
    reviewCount: product.reviewCount,
    category: product.category,
    brand: product.brand,
  };
}

export function wishlistItemToProductSummary(item: WishlistItem): ProductSummary {
  return {
    id: item.id,
    sku: item.sku ?? "",
    name: item.name,
    listedPrice: item.listedPrice,
    price: item.price,
    thumbnailUrl: item.thumbnailUrl,
    inStock: item.inStock,
    availableStock: item.availableStock,
    rating: item.rating,
    reviewCount: item.reviewCount,
    category: item.category ?? {
      id: 0,
      name: "",
      description: "",
      active: true,
    },
    brand: item.brand,
  };
}

class WishlistService {
  getAll(): WishlistItem[] {
    return readStorage();
  }

  getCount(): number {
    return readStorage().length;
  }

  isInWishlist(productId: string): boolean {
    return readStorage().some((item) => item.id === productId);
  }

  add(product: ProductSummary | ProductDetail): boolean {
    const items = readStorage();
    if (items.some((item) => item.id === product.id)) {
      return false;
    }
    items.unshift(productToWishlistItem(product));
    writeStorage(items);
    toast.success("Đã thêm vào danh sách yêu thích");
    return true;
  }

  remove(productId: string): boolean {
    const items = readStorage().filter((item) => item.id !== productId);
    const removed = items.length !== readStorage().length;
    if (removed) {
      writeStorage(items);
      toast.success("Đã xóa khỏi danh sách yêu thích");
    }
    return removed;
  }

  toggle(product: ProductSummary | ProductDetail): boolean {
    if (this.isInWishlist(product.id)) {
      this.remove(product.id);
      return false;
    }
    this.add(product);
    return true;
  }

  clear(): void {
    writeStorage([]);
    toast.info("Đã xóa toàn bộ sản phẩm yêu thích");
  }
}

export const wishlistService = new WishlistService();
