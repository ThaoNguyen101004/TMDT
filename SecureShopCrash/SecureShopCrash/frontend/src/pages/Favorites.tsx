import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import ConfirmDialog from "../components/ConfirmDialog";
import {
  wishlistService,
  wishlistItemToProductSummary,
  type WishlistItem,
} from "../utils/wishlistService";
import { cartService } from "../utils/cartService";
import type { ProductSummary } from "../types/types";

const Favorites: React.FC = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [confirmClear, setConfirmClear] = useState(false);

  const loadWishlist = useCallback(() => {
    setItems(wishlistService.getAll());
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadWishlist();
    window.addEventListener("wishlistUpdated", loadWishlist);
    return () => window.removeEventListener("wishlistUpdated", loadWishlist);
  }, [loadWishlist]);

  const handleAddToCart = async (product: ProductSummary) => {
    await cartService.addToCart(product, 1);
  };

  const handleClearAll = () => {
    wishlistService.clear();
    setConfirmClear(false);
  };

  const products = items.map(wishlistItemToProductSummary);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-100 rounded-xl">
              <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-800">Sản phẩm yêu thích</h1>
              <p className="text-gray-600 text-sm mt-1">
                {items.length > 0 ? `${items.length} sản phẩm đã lưu` : "Chưa có sản phẩm nào trong danh sách"}
              </p>
            </div>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Xóa tất cả
            </button>
          )}
        </div>
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border py-16 px-6 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-zinc-800 mb-2">Danh sách yêu thích trống</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Nhấn biểu tượng trái tim trên sản phẩm để lưu vào đây.
            </p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700">
              <ShoppingBag className="w-5 h-5" />
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
      <Footer />
      <ConfirmDialog open={confirmClear} title="Xóa toàn bộ yêu thích?" message="Bạn có chắc muốn xóa tất cả sản phẩm khỏi danh sách yêu thích?" confirmText="Xóa tất cả" cancelText="Hủy" onConfirm={handleClearAll} onCancel={() => setConfirmClear(false)} />
    </div>
  );
};

export default Favorites;
