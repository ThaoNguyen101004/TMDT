import React, { useState, useEffect } from 'react';
import { ChevronDown, Tag, TrendingUp, Gift, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categoryApi, brandApi } from '../utils/api';
import type { CategorySummary, Brand } from '../types/types';
import { motion, AnimatePresence } from 'framer-motion';

const MegaMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && categories.length === 0) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, brandRes] = await Promise.all([
        categoryApi.getAll(),
        brandApi.getAll()
      ]);
      setCategories(catRes.content || catRes);
      setBrands(brandRes.content || brandRes);
    } catch (error) {
      console.error('Error fetching menu data:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { label: 'Thương hiệu', icon: <Tag className="w-4 h-4" /> },
    { label: 'Khuyến mãi', icon: <TrendingUp className="w-4 h-4" /> },
    { label: 'Deal Hot', icon: <Zap className="w-4 h-4" /> },
    { label: 'Combo', icon: <Gift className="w-4 h-4" /> },
  ];

  return (
    <div className="relative group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors"
      >
        <span>Danh Mục</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 top-full mt-0 w-screen bg-white shadow-lg z-40"
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="grid grid-cols-4 gap-8">
                {/* Danh Mục */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase">Danh Mục</h3>
                  <ul className="space-y-2">
                    {loading ? (
                      <li className="text-gray-500 text-sm">Đang tải...</li>
                    ) : (
                      categories.slice(0, 6).map((cat) => (
                        <li key={cat.id}>
                          <Link
                            to={`/products?category=${cat.id}`}
                            onClick={() => setIsOpen(false)}
                            className="text-gray-600 hover:text-purple-600 text-sm transition-colors"
                          >
                            {cat.name}
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                {/* Thương Hiệu */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase">Thương Hiệu</h3>
                  <ul className="space-y-2">
                    {loading ? (
                      <li className="text-gray-500 text-sm">Đang tải...</li>
                    ) : (
                      brands.slice(0, 6).map((brand) => (
                        <li key={brand.id}>
                          <Link
                            to={`/products?brand=${brand.id}`}
                            onClick={() => setIsOpen(false)}
                            className="text-gray-600 hover:text-purple-600 text-sm transition-colors"
                          >
                            {brand.name}
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                {/* Promotions */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase">Khuyến Mãi</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        to="/products"
                        onClick={() => setIsOpen(false)}
                        className="text-gray-600 hover:text-purple-600 text-sm transition-colors flex items-center gap-2"
                      >
                        <Zap className="w-3 h-3 text-yellow-500" />
                        Flash Sale
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/products"
                        onClick={() => setIsOpen(false)}
                        className="text-gray-600 hover:text-purple-600 text-sm transition-colors flex items-center gap-2"
                      >
                        <Gift className="w-3 h-3 text-pink-500" />
                        Combo Deal
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/products"
                        onClick={() => setIsOpen(false)}
                        className="text-gray-600 hover:text-purple-600 text-sm transition-colors"
                      >
                        Giảm Giá Lên Tới 50%
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Featured Banner */}
                <div>
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4 h-full flex flex-col justify-between">
                    <div>
                      <p className="text-purple-900 font-bold text-sm mb-2">🎁 Ưu Đãi Đặc Biệt</p>
                      <p className="text-xs text-gray-700 mb-3">
                        Giảm 30% cho đơn hàng đầu tiên
                      </p>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="bg-purple-600 text-white text-xs py-2 px-3 rounded font-semibold hover:bg-purple-700 transition-colors w-full"
                    >
                      Khám Phá Ngay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MegaMenu;
