import React from 'react';
import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BannerCarousel from '../components/BannerCarousel';
import VoucherSection from '../components/VoucherSection';
import FeaturedCategories from '../components/FeaturedCategories';
import FeaturedProducts from '../components/FeaturedProducts';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {

  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  

  return (
    <div className="min-h-screen beauty-shell">
      <Header/>
      <main className="space-y-0">
        {/* Hero Banner Carousel */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <BannerCarousel />
        </section>

        {/* Voucher Section */}
        <VoucherSection />

        {/* Featured Categories */}
        <FeaturedCategories />

        {/* Featured Products */}
        <FeaturedProducts />
        
        {/* Why Choose Us Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-zinc-800 mb-4">Tại sao chọn Lumière Beauty?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Chúng tôi cam kết mang đến trải nghiệm mua sắm mỹ phẩm tinh tế, an toàn và đáng tin cậy.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="text-xl font-semibold text-zinc-800 mb-3">Chất lượng đảm bảo</h3>
                <p className="text-gray-600">
                  Tất cả sản phẩm đều được tuyển chọn kỹ lưỡng, phù hợp cho nhiều loại da và nhu cầu làm đẹp.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold text-zinc-800 mb-3">Giao hàng nhanh</h3>
                <p className="text-gray-600">
                  Giao hàng toàn quốc trong 24-48h, đóng gói cẩn thận và hỗ trợ đổi trả nhanh chóng.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-xl font-semibold text-zinc-800 mb-3">Tư vấn 24/7</h3>
                <p className="text-gray-600">
                  Đội ngũ tư vấn làm đẹp sẵn sàng hỗ trợ bạn mọi lúc mọi nơi.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-rose-500 to-fuchsia-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Sẵn sàng nâng cấp routine làm đẹp của bạn?</h2>
            <p className="text-xl mb-8 opacity-90">
              Liên hệ ngay để được tư vấn sản phẩm phù hợp với làn da và phong cách của bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white text-rose-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Tư vấn miễn phí
              </Link>
              <Link
                to="tel:0123456789"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-rose-600 transition-colors"
              >
                Gọi Ngay: 0123 456 789
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;