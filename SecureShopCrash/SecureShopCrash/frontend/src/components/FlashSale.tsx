import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../utils/api';
import { cartService } from '../utils/cartService';
import type { ProductSummary } from '../types/types';
import { Zap, Star, ShoppingCart, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useUIConfig } from '../stores/uiConfigStore';

// ── Đồng hồ đếm ngược ────────────────────────────────────────────────────────

const STORAGE_KEY = 'flashSaleEnd';

function getEndTime(durationHours: number): Date {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored) {
    const t = new Date(stored);
    if (t > new Date()) return t;
  }
  const end = new Date(Date.now() + durationHours * 60 * 60 * 1000);
  sessionStorage.setItem(STORAGE_KEY, end.toISOString());
  return end;
}

function useCountdown(durationHours: number) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  const endTime = useRef(getEndTime(durationHours));

  // Reset when duration changes
  useEffect(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    endTime.current = getEndTime(durationHours);
  }, [durationHours]);

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, endTime.current.getTime() - Date.now());
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setTimeLeft({ h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [durationHours]);

  return timeLeft;
}

const Pad = ({ n }: { n: number }) => (
  <span className="inline-flex flex-col items-center">
    <span className="bg-red-600 text-white text-lg font-black px-2.5 py-1 rounded-lg min-w-[2.4rem] text-center tabular-nums shadow">
      {String(n).padStart(2, '0')}
    </span>
  </span>
);

// ── Card sản phẩm Flash Sale ──────────────────────────────────────────────────
const FlashCard: React.FC<{ product: ProductSummary; visibleCount: number; onAddToCart: (p: ProductSummary) => void }> = ({
  product,
  visibleCount,
  onAddToCart,
}) => {
  const discountPct =
    product.listedPrice > 0
      ? Math.round(((product.listedPrice - product.price) / product.listedPrice) * 100)
      : 0;

  const fmt = (v: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  return (
    <div 
      className="group relative flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex-shrink-0"
      style={{ width: `calc((100% - ${(visibleCount - 1) * 16}px) / ${visibleCount})` }}
    >
      {/* Badge % giảm */}
      {discountPct > 0 && (
        <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
          -{discountPct}%
        </span>
      )}

      {/* Ảnh */}
      <Link to={`/products/${product.id}`} className="block overflow-hidden bg-pink-50">
        {product.thumbnailUrl ? (
          <img
            src={product.thumbnailUrl}
            alt={product.name}
            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-40 flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-50">
            <ShoppingCart className="w-10 h-10 text-pink-300" />
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <Link to={`/products/${product.id}`}>
          <p className="text-xs font-semibold text-gray-800 line-clamp-2 hover:text-pink-500 transition-colors mb-1 leading-snug">
            {product.name}
          </p>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-gray-500">{product.rating.toFixed(1)}</span>
          {product.reviewCount > 0 && (
            <span className="text-xs text-gray-400">({product.reviewCount})</span>
          )}
        </div>

        {/* Giá */}
        <div className="mt-auto">
          <p className="text-red-500 font-bold text-sm">{fmt(product.price)}</p>
          {discountPct > 0 && (
            <p className="text-gray-400 text-xs line-through">{fmt(product.listedPrice)}</p>
          )}
        </div>

        {/* Thanh tiến trình tồn kho */}
        {product.availableStock !== undefined && (
          <div className="mt-2">
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-400 to-pink-500 h-1.5 rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.max(5, (product.availableStock / 100) * 100))}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {product.availableStock > 0 ? `Còn ${product.availableStock} sản phẩm` : 'Hết hàng'}
            </p>
          </div>
        )}

        {/* Nút thêm giỏ */}
        <button
          onClick={() => onAddToCart(product)}
          disabled={!product.inStock}
          className={`mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            product.inStock
              ? 'bg-red-500 hover:bg-red-600 text-white active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {product.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
        </button>
      </div>
    </div>
  );
};

// ── Component chính ───────────────────────────────────────────────────────────

const FlashSale: React.FC = () => {
  const { config } = useUIConfig();
  const { durationHours, visibleCount } = config.flashSale;

  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const { h, m, s } = useCountdown(durationHours);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await productApi.getAll({ page: 0, size: 50, sort: 'price,asc' });
        const all: ProductSummary[] = res.content || [];
        const saleItems = all.filter((p) => p.listedPrice > 0 && p.price < p.listedPrice);
        setProducts(saleItems);
      } catch (e) {
        console.error('FlashSale load error:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAddToCart = useCallback(async (product: ProductSummary) => {
    const ok = await cartService.addToCart(product);
    if (ok) {
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success(`Đã thêm "${product.name}" vào giỏ!`);
    }
  }, []);

  const maxOffset = Math.max(0, products.length - visibleCount);
  const prev = () => setOffset((o) => Math.max(0, o - 1));
  const next = () => setOffset((o) => Math.min(maxOffset, o + 1));

  if (loading) {
    return (
      <section className="py-8 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-72 bg-pink-100 animate-pulse rounded-xl mb-6" />
          <div className="flex gap-4">
            {[...Array(visibleCount)].map((_, i) => (
              <div 
                key={i} 
                className="h-72 bg-pink-50 rounded-2xl animate-pulse flex-shrink-0"
                style={{ width: `calc((100% - ${(visibleCount - 1) * 16}px) / ${visibleCount})` }}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-8 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {/* Tiêu đề + đồng hồ */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Icon + tên */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center shadow-lg shadow-red-200">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-red-500 uppercase tracking-wide leading-none">
                  Flash Sale
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Ưu đãi có hạn – Nhanh tay kẻo lỡ!</p>
              </div>
            </div>

            {/* Đồng hồ */}
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-red-400" />
              <span className="text-xs font-medium text-gray-500 mr-1">Kết thúc sau:</span>
              <Pad n={h} />
              <span className="text-red-500 font-black text-lg">:</span>
              <Pad n={m} />
              <span className="text-red-500 font-black text-lg">:</span>
              <Pad n={s} />
            </div>
          </div>

          {/* Xem tất cả + mũi tên */}
          <div className="flex items-center gap-3">
            <Link
              to="/products"
              className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors whitespace-nowrap"
            >
              Xem tất cả →
            </Link>
            <button
              onClick={prev}
              disabled={offset === 0}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                offset === 0
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-red-400 text-red-500 hover:bg-red-50 hover:scale-105'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              disabled={offset >= maxOffset}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                offset >= maxOffset
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-red-400 text-red-500 hover:bg-red-50 hover:scale-105'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slider sản phẩm */}
        <div className="overflow-hidden rounded-2xl">
          <motion.div
            className="flex gap-4"
            animate={{ x: `calc(-${offset} * ((100% + 16px) / ${visibleCount}))` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {products.map((product) => (
              <FlashCard key={product.id} product={product} visibleCount={visibleCount} onAddToCart={handleAddToCart} />
            ))}
          </motion.div>
        </div>

        {/* Dot indicators */}
        {products.length > visibleCount && (
          <div className="flex justify-center gap-1.5 mt-5">
            {Array.from({ length: maxOffset + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setOffset(i)}
                className={`rounded-full transition-all duration-200 ${
                  i === offset ? 'w-4 h-2 bg-red-500' : 'w-2 h-2 bg-red-200 hover:bg-red-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FlashSale;
