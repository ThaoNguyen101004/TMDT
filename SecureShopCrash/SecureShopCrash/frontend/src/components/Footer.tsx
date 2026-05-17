import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import type { CategorySummary } from '../types/types';
import { categoryApi } from '../utils/api';

const Footer: React.FC = () => {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <footer className="bg-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-rose-400" />
              <span className="text-xl font-bold">Lumière Beauty</span>
            </div>
            <p className="text-gray-300 text-sm">
              Chuyên cung cấp mỹ phẩm, skincare và nước hoa chất lượng cao, giúp bạn chăm sóc và tỏa sáng mỗi ngày.
            </p>
            <div className="flex space-x-4">
              <Link to="#" className="text-gray-300 hover:text-rose-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-gray-300 hover:text-rose-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-rose-400">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-cyan-500 transition-colors text-sm">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-rose-400 transition-colors text-sm">
                  Mỹ phẩm
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-rose-400 transition-colors text-sm">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-rose-400">Danh mục mỹ phẩm</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link to={`/products?category=${category.id}`} className="text-gray-300 hover:text-rose-400 transition-colors text-sm">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-rose-400">Thông tin liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-rose-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">123 Đường Hoa Hồng, Quận 1, TP.HCM</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-rose-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">0123 456 789</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-rose-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">hello@lumierebeauty.vn</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-300 text-sm">
              © 2025 Lumière Beauty. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-gray-300 hover:text-rose-400 transition-colors text-sm">
                Chính sách bảo mật
              </Link>
              <Link to="/terms" className="text-gray-300 hover:text-rose-400 transition-colors text-sm">
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;