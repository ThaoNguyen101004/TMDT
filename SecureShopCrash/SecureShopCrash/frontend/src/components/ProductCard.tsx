import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Star, Loader2, Zap, Package, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import type { ProductSummary } from '../types/types';

interface ProductCardProps {
  product: ProductSummary;
  onAddToCart?: (product: ProductSummary) => Promise<void> | void;
}

// Helper function to determine product tags
const getProductTags = (product: ProductSummary): Array<{label: string; type: 'new' | 'sale' | 'hot' | 'freeship'}> => {
  const tags = [];
  const createdAt = new Date(product.createdAt || '');
  const daysAgo = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysAgo <= 7) tags.push({ label: 'Mới', type: 'new' });
  
  if (product.price < (product.listedPrice || product.price)) {
    const discount = Math.round(((product.listedPrice! - product.price) / product.listedPrice!) * 100);
    tags.push({ label: `Giảm ${discount}%`, type: 'sale' });
  }
  
  if (product.reviewCount > 50 || product.rating >= 4.5) {
    tags.push({ label: 'Hot', type: 'hot' });
  }
  
  if (Math.random() > 0.6) tags.push({ label: 'Freeship', type: 'freeship' });
  
  return tags.slice(0, 2);
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [isAdding, setIsAdding] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);

  const handleAddToCart = async () => {
    if (!product.inStock) {
      toast.warning('Sản phẩm hiện đã hết hàng!');
      return;
    }

    if (product.availableStock !== undefined && product.availableStock <= 0) {
      toast.warning('Sản phẩm tạm hết trong kho!');
      return;
    }

    if (!onAddToCart) {
      toast.error('Không thể thêm sản phẩm — chưa có handler.');
      return;
    }

    try {
      setIsAdding(true);
      await onAddToCart(product);
      window.dispatchEvent(new Event('cartUpdated'));
    } finally {
      setIsAdding(false);
    }
  };

  const tags = getProductTags(product);
  const discount = product.listedPrice && product.price < product.listedPrice 
    ? Math.round(((product.listedPrice - product.price) / product.listedPrice) * 100)
    : 0;

  const tagColors = {
    new: 'bg-blue-500',
    sale: 'bg-red-500',
    hot: 'bg-yellow-500',
    freeship: 'bg-green-500',
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col group relative"
    >
      {/* Product image */}
      <div className="relative">
        <img
          src={product.thumbnailUrl}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Tags/Badges */}
        <div className="absolute top-2 left-2 flex gap-2 flex-wrap">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className={`${tagColors[tag.type]} text-white text-xs font-bold px-2 py-1 rounded`}
            >
              {tag.label}
            </span>
          ))}
          {discount > 0 && (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
              <Zap className="w-3 h-3" />
              -{discount}%
            </span>
          )}
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Hết hàng</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
            title="Yêu thích"
          >
            <Heart className="h-4 w-4 text-red-500" />
          </button>
          <Link
            to={`/products/${product.id}`}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            <Eye className="h-4 w-4 text-zinc-800" />
          </Link>
        </div>
      </div>

      {/* Product info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-cyan-500 font-medium uppercase tracking-wide">
            {product.category.name}
          </span>
          {product.brand && (
            <span className="text-xs text-purple-600 font-semibold bg-purple-50 px-2 py-1 rounded">
              {product.brand.name}
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-zinc-800 mb-2 line-clamp-2 min-h-[3.5rem]">
          <Link
            to={`/products/${product.id}`}
            className="hover:text-purple-600 transition-colors"
          >
            {product.name}
          </Link>
        </h3>

        <div className="min-h-[1.25rem] mb-3">
          {product.reviewCount > 0 && (
            <div className="flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                ({product.reviewCount})
              </span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-purple-600">
              {formatPrice(product.price)}
            </span>
            {product.listedPrice && product.price < product.listedPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.listedPrice)}
              </span>
            )}
          </div>
          {product.inStock && (
            <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded flex items-center gap-1">
              <Package className="w-3 h-3" />
              Còn {product.availableStock || 'nhiều'}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto flex space-x-2">
          <Link
            to={`/products/${product.id}`}
            className="flex-1 bg-gray-100 text-zinc-800 px-4 py-2 rounded-lg text-center hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Xem chi tiết
          </Link>

          {product.inStock ? (
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors ${
                isAdding ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              aria-label="Thêm vào giỏ hàng"
            >
              {isAdding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )}
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-200 text-gray-500 p-2 rounded-lg cursor-not-allowed"
              aria-label="Hết hàng"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;