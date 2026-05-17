import React, { useEffect, useState } from 'react';
import { cartService } from '../utils/cartService';
import { api } from '../utils/axiosConfig';
import type { Combo, ProductSummary } from '../types/types';
import { toast } from 'react-toastify';

export const GlobalComboPopup: React.FC = () => {
  const [show, setShow] = useState(false);
  const [product, setProduct] = useState<ProductSummary | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleRequestAdd = async (e: Event) => {
      const customEvent = e as CustomEvent<{ product: ProductSummary; quantity: number }>;
      const p = customEvent.detail.product;
      const q = customEvent.detail.quantity;
      
      setIsProcessing(true);
      try {
        const { data } = await api.get(`/combos/product/${p.id}`);
        if (data && data.length > 0) {
          setProduct(p);
          setQuantity(q);
          setCombos(data);
          setShow(true);
        } else {
          // No combo, add directly
          const success = await cartService.addToCart(p, q);
          if (success) {
            window.dispatchEvent(new Event('cartUpdated'));
          }
        }
      } catch (error) {
        console.error("Error checking combos:", error);
        // Fallback to direct add
        const success = await cartService.addToCart(p, q);
        if (success) {
          window.dispatchEvent(new Event('cartUpdated'));
        }
      } finally {
        setIsProcessing(false);
      }
    };

    window.addEventListener('requestAddToCart', handleRequestAdd);
    return () => window.removeEventListener('requestAddToCart', handleRequestAdd);
  }, []);

  const handleAddComboToCart = async (combo: Combo) => {
    try {
      const originalPrice = combo.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
      let finalPrice = combo.fixedPrice || 0;
      if (combo.discountPercent) {
        finalPrice = originalPrice * ((100 - combo.discountPercent) / 100);
      }

      // Calculate min available stock for the combo
      let minAvailable = 999;
      for (const item of combo.items) {
        const productStock = item.product.availableStock || 0;
        const possibleCombos = Math.floor(productStock / item.quantity);
        if (possibleCombos < minAvailable) minAvailable = possibleCombos;
      }

      await cartService.addToCart(
        {
          id: combo.id, // Use comboId as productId
          name: combo.name,
          price: finalPrice,
          thumbnailUrl: combo.thumbnailUrl,
          inStock: minAvailable > 0 && combo.active,
          availableStock: minAvailable,
          comboId: combo.id,
        },
        1
      );
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success('Đã thêm combo vào giỏ hàng!');
      setShow(false);
    } catch (error) {
      toast.error('Lỗi khi thêm combo vào giỏ');
    }
  };

  const handleAddToCartWithoutCombo = async () => {
    if (!product) return;
    const success = await cartService.addToCart(product, quantity);
    if (success) {
      window.dispatchEvent(new Event('cartUpdated'));
    }
    setShow(false);
  };

  if (!show || combos.length === 0 || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300">
        <div className="p-6 text-center border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sản phẩm đang có trong combo tiết kiệm hơn!</h2>
          <p className="text-gray-500">Nâng cấp lên combo để được giảm giá sâu</p>
        </div>
        
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {combos.map((combo) => {
            const originalPrice = combo.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
            let finalPrice = combo.fixedPrice || 0;
            if (combo.discountPercent) {
              finalPrice = originalPrice * ((100 - combo.discountPercent) / 100);
            }
            const savings = originalPrice - finalPrice;

            return (
              <div key={combo.id} className="border border-pink-200 rounded-xl p-4 bg-pink-50/30">
                <div className="flex items-start mb-4">
                  <img src={combo.thumbnailUrl} className="w-20 h-20 rounded-lg object-cover mr-4" alt="" />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{combo.name}</h3>
                    <p className="text-sm text-gray-600">Gồm {combo.items.length} sản phẩm</p>
                    <div className="mt-2 text-sm">
                      <span className="text-gray-400 line-through mr-2">{originalPrice.toLocaleString('vi-VN')}đ</span>
                      <span className="font-bold text-pink-600 text-lg">{finalPrice.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div className="text-xs font-semibold text-green-600 mt-1">Tiết kiệm: {savings.toLocaleString('vi-VN')}đ</div>
                  </div>
                </div>

                <div className="bg-white/60 rounded-lg p-3 mb-4 space-y-2">
                  <p className="text-xs font-bold text-gray-700 uppercase mb-2">Gồm {combo.items.length} sản phẩm:</p>
                  {combo.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img src={item.product.thumbnailUrl} alt={item.product.name} className="w-10 h-10 rounded object-cover border border-gray-100" />
                      <span className="text-sm text-gray-800 font-medium line-clamp-1">
                        {item.quantity}x {item.product.name}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => handleAddComboToCart(combo)}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  Thêm combo vào giỏ
                </button>
              </div>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
          <button
            onClick={handleAddToCartWithoutCombo}
            className="text-gray-500 hover:text-gray-800 font-medium transition-colors"
          >
            Không, chỉ mua sản phẩm lẻ
          </button>
        </div>
      </div>
    </div>
  );
};
