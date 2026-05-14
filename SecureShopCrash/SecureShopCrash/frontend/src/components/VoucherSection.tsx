import React, { useState } from 'react';
import { Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

interface Voucher {
  id: string;
  code: string;
  discountAmount: string;
  description: string;
  minOrder: string;
}

const VOUCHERS: Voucher[] = [
  {
    id: '1',
    code: 'GIẢM30K',
    discountAmount: '30K',
    description: 'Mã giảm 30K cho đơn hàng từ 499K áp dụng với một số sản phẩm nhất định.',
    minOrder: '499K',
  },
  {
    id: '2',
    code: 'GIẢM25K',
    discountAmount: '25K',
    description: 'Mã giảm 25K cho đơn hàng từ 399K áp dụng với một số sản phẩm nhất định.',
    minOrder: '399K',
  },
  {
    id: '3',
    code: 'GIẢM15K',
    discountAmount: '15K',
    description: 'Mã giảm 15K cho đơn hàng từ 299K áp dụng với một số sản phẩm nhất định.',
    minOrder: '299K',
  },
  {
    id: '4',
    code: 'GIẢM10K',
    discountAmount: '10K',
    description: 'Mã giảm 10K cho đơn hàng từ 199K áp dụng với một số sản phẩm nhất định.',
    minOrder: '199K',
  },
  {
    id: '5',
    code: 'SALE50K',
    discountAmount: '50K',
    description: 'Mã giảm 50K cho đơn hàng từ 799K áp dụng với một số sản phẩm nhất định.',
    minOrder: '799K',
  },
  {
    id: '6',
    code: 'VIP35K',
    discountAmount: '35K',
    description: 'Mã giảm 35K cho khách hàng thành viên từ 499K áp dụng với một số sản phẩm nhất định.',
    minOrder: '499K',
  },
];

const VoucherSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Đã sao chép mã: ${code}`, {
      position: 'bottom-right',
      autoClose: 2000,
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + VOUCHERS.length) % VOUCHERS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % VOUCHERS.length);
  };

  // Show 4 vouchers at a time
  const visibleVouchers = [
    VOUCHERS[currentIndex],
    VOUCHERS[(currentIndex + 1) % VOUCHERS.length],
    VOUCHERS[(currentIndex + 2) % VOUCHERS.length],
    VOUCHERS[(currentIndex + 3) % VOUCHERS.length],
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Mã Giảm Giá Đặc Biệt
          </h2>
          <p className="text-gray-600 text-lg">
            Nhập mã giảm giá để tiết kiệm khi mua sắm tại Lumière Beauty
          </p>
        </div>

        {/* Carousel Container - Full Width */}
        <div className="relative">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 rounded-full p-2 shadow-lg transition-all hover:shadow-xl"
            aria-label="Previous vouchers"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          {/* Vouchers Grid - 4 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnimatePresence mode="wait">
              {visibleVouchers.map((voucher, index) => (
                <motion.div
                  key={voucher.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group"
                >
                  {/* Voucher Card - White with Dashed Border */}
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-2 border-dashed border-gray-300">
                    <div className="p-4 flex flex-col">
                      {/* Top Section - Yellow Badge */}
                      <div className="flex items-center justify-center bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-lg px-3 py-4 mb-4 shadow-sm">
                        <div className="text-center">
                          <span className="text-xs font-bold text-red-700 block">MÃ GIẢM</span>
                          <span className="text-3xl font-black text-yellow-700">{voucher.discountAmount}</span>
                        </div>
                      </div>

                      {/* Middle Section - Code & Info */}
                      <div className="flex-1 mb-3">
                        <p className="text-xs font-bold text-red-600 mb-1">NHẬP MÃ: GIẢM {voucher.discountAmount}</p>
                        <p className="text-sm font-bold text-gray-900 tracking-wider mb-2">{voucher.code}</p>
                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                          {voucher.description}
                        </p>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopyCode(voucher.code)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold rounded-md py-2 transition-all text-xs flex items-center justify-center gap-1 shadow-sm"
                        >
                          <Copy className="w-3 h-3" />
                          Sao chép mã
                        </button>
                        <button className="flex-1 bg-white border-2 border-blue-500 hover:bg-blue-50 text-blue-600 font-bold rounded-md py-2 transition-all text-xs">
                          Điều kiện
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 rounded-full p-2 shadow-lg transition-all hover:shadow-xl"
            aria-label="Next vouchers"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {VOUCHERS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-red-500 w-8'
                  : 'bg-gray-300 w-2 hover:bg-gray-400'
              }`}
              aria-label={`Go to voucher ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VoucherSection;
