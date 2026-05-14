import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Flower2, Droplets, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'Trang điểm',
      description: 'Màu sắc nổi bật, giữ lớp lâu và dễ phối'
    },
    {
      icon: Droplets,
      title: 'Chăm sóc da',
      description: 'Serum, toner và kem dưỡng cho mọi loại da'
    },
    {
      icon: Flower2,
      title: 'Nước hoa & body care',
      description: 'Mùi hương tinh tế, lưu hương lâu'
    },
    {
      icon: ShieldCheck,
      title: 'Hàng chính hãng',
      description: 'Cam kết nguồn gốc rõ ràng, an toàn cho làn da'
    }
  ];

  return (
    <section className="relative bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-700 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Nâng Tầm
                <span className="block text-amber-100">Vẻ Đẹp Của Bạn</span>
              </h1>
              <p className="text-xl text-gray-200 leading-relaxed">
                Khám phá bộ sưu tập mỹ phẩm, skincare và nước hoa được tuyển chọn kỹ lưỡng,
                giúp bạn chăm sóc và tỏa sáng mỗi ngày.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="bg-cyan-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-cyan-600 transition-colors text-center"
              >
                Khám Phá Mỹ Phẩm
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-rose-600 transition-colors text-center"
              >
                Tư Vấn Làm Đẹp
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-100">1000+</div>
                <div className="text-gray-200">Khách hàng yêu thích</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-100">24/7</div>
                <div className="text-gray-200">Tư vấn sắc đẹp</div>
              </div>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Beauty Products"
              className="rounded-lg shadow-2xl"
              loading="eager"
            />
            <div className="absolute -bottom-6 -left-6 bg-white text-zinc-800 p-6 rounded-lg shadow-xl">
              <div className="flex items-center space-x-3">
                <Sparkles className="h-8 w-8 text-rose-500" />
                <div>
                  <div className="font-bold">Sản phẩm chính hãng</div>
                  <div className="text-sm text-gray-600">An toàn cho làn da</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-opacity-20 transition-all duration-300 border border-white/10"
            >
              <feature.icon className="h-12 w-12 text-amber-100 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-sm">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;