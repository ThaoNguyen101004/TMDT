import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Clock, TrendingUp } from "lucide-react";
import { api } from "../utils/axiosConfig";
import type { Combo } from "../types/types";
import { cartService } from "../utils/cartService";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ComboDeals: React.FC = () => {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCombos();
  }, []);

  const fetchCombos = async () => {
    try {
      const { data } = await api.get<Combo[]>("/combos");
      setCombos(data);
    } catch (error) {
      console.error("Error fetching combos", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateOriginalPrice = (combo: Combo) => {
    return combo.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const handleAddComboToCart = async (combo: Combo) => {
    const originalPrice = calculateOriginalPrice(combo);
    let finalPrice = combo.fixedPrice || 0;
    if (combo.discountPercent) {
      finalPrice = originalPrice * ((100 - combo.discountPercent) / 100);
    }

    let minAvailable = 999;
    for (const item of combo.items) {
      const productStock = item.product.availableStock || 0;
      const possibleCombos = Math.floor(productStock / item.quantity);
      if (possibleCombos < minAvailable) minAvailable = possibleCombos;
    }

    const success = await cartService.addToCart(
      {
        id: combo.id,
        name: combo.name,
        price: finalPrice,
        thumbnailUrl: combo.thumbnailUrl,
        inStock: minAvailable > 0 && combo.active,
        availableStock: minAvailable,
        comboId: combo.id,
      },
      1
    );

    if (success) {
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight flex items-center justify-center">
            <Package className="w-10 h-10 text-pink-600 mr-3" />
            Siêu Ưu Đãi Combo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tiết kiệm hơn khi mua sắm cùng các combo mỹ phẩm được thiết kế độc quyền từ chuyên gia chăm sóc sắc đẹp.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
          </div>
        ) : combos.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Chưa có Combo nào</h3>
            <p className="text-gray-500">Hãy quay lại sau để săn những ưu đãi hấp dẫn nhé!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {combos.map((combo) => {
              const originalPrice = calculateOriginalPrice(combo);
              let finalPrice = combo.fixedPrice || 0;
              if (combo.discountPercent) {
                finalPrice = originalPrice * ((100 - combo.discountPercent) / 100);
              }
              const savings = originalPrice - finalPrice;

              return (
                <div key={combo.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col group">
                  <div className="relative">
                    <img 
                      src={combo.thumbnailUrl} 
                      alt={combo.name} 
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-red-500 text-white font-bold px-3 py-1.5 rounded-full shadow-md animate-pulse">
                      Tiết kiệm {savings.toLocaleString("vi-VN")}đ
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{combo.name}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{combo.description}</p>
                    
                    <div className="flex items-end justify-between mb-6 mt-auto">
                      <div>
                        <p className="text-xs text-gray-400 line-through mb-1">
                          {originalPrice.toLocaleString("vi-VN")}đ
                        </p>
                        <p className="text-3xl font-extrabold text-pink-600">
                          {finalPrice.toLocaleString("vi-VN")}
                          <span className="text-sm font-medium ml-1">đ</span>
                        </p>
                      </div>
                      <div className="flex items-center text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                        <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                        Còn {Math.max(0, Math.floor((new Date(combo.endTime).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} ngày
                      </div>
                    </div>

                    <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Gồm {combo.items.length} sản phẩm:</p>
                      {combo.items.map((item) => (
                        <div key={item.product.id} className="flex items-center text-sm">
                          <img src={item.product.thumbnailUrl} className="w-8 h-8 rounded object-cover mr-3 border border-gray-200" alt="" />
                          <span className="text-gray-700 truncate flex-grow" title={item.product.name}>
                            {item.quantity}x {item.product.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleAddComboToCart(combo)}
                      className="w-full bg-gray-900 hover:bg-pink-600 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
                    >
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Thêm Combo Vào Giỏ
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ComboDeals;
