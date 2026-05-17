import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryApi } from '../utils/api';
import type { CategorySummary } from '../types/types';
import {
  Sparkles,
  Palette,
  Droplets,
  Wind,
  Heart,
  Zap,
  Pipette,
  Brush,
  Scroll,
  Feather,
  Sun,
  Cloud,
  Leaf,
  Flower,
  Star,
  Moon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const CATEGORY_ICONS: Record<number, React.ReactNode> = {
  1: <Sparkles className="w-10 h-10" />,
  2: <Droplets className="w-10 h-10" />,
  3: <Wind className="w-10 h-10" />,
  4: <Pipette className="w-10 h-10" />,
  5: <Palette className="w-10 h-10" />,
  6: <Heart className="w-10 h-10" />,
  7: <Zap className="w-10 h-10" />,
  8: <Brush className="w-10 h-10" />,
  9: <Scroll className="w-10 h-10" />,
  10: <Feather className="w-10 h-10" />,
  11: <Sun className="w-10 h-10" />,
  12: <Cloud className="w-10 h-10" />,
  13: <Leaf className="w-10 h-10" />,
  14: <Flower className="w-10 h-10" />,
  15: <Star className="w-10 h-10" />,
  16: <Moon className="w-10 h-10" />,
};

const PAGE_SIZE = 10;

const FeaturedCategories: React.FC = () => {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAll();
        const cats = (res as any).content ?? res;
        setCategories(cats);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const totalPages = Math.ceil(categories.length / PAGE_SIZE);
  const visibleCategories = categories.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const handlePrev = () => setPage((p) => Math.max(0, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  if (loading) {
    return (
      <section className="py-12 bg-white w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="h-32 bg-gray-200 animate-pulse rounded-lg" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-wider">
            Danh Mục Nổi Bật
          </h2>

          {/* Arrows + page dots */}
          {totalPages > 1 && (
            <div className="flex items-center gap-3">
              {/* Dot indicators */}
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`rounded-full transition-all duration-200 ${
                      i === page
                        ? 'w-4 h-4 bg-pink-500'
                        : 'w-2.5 h-2.5 bg-pink-200 hover:bg-pink-300'
                    }`}
                    aria-label={`Trang ${i + 1}`}
                  />
                ))}
              </div>

              {/* Prev button */}
              <button
                onClick={handlePrev}
                disabled={page === 0}
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  page === 0
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-pink-400 text-pink-500 hover:bg-pink-50 hover:border-pink-500 hover:scale-105'
                }`}
                aria-label="Trang trước"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Next button */}
              <button
                onClick={handleNext}
                disabled={page === totalPages - 1}
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  page === totalPages - 1
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-pink-400 text-pink-500 hover:bg-pink-50 hover:border-pink-500 hover:scale-105'
                }`}
                aria-label="Trang sau"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Categories Circle Row */}
        <div className="flex flex-nowrap justify-between gap-4">
          {visibleCategories.map((category, index) => {
            const globalIndex = page * PAGE_SIZE + index + 1;
            return (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group flex flex-col items-center flex-1 min-w-0"
              >
                {/* Circle with Pink Border */}
                <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full border-4 border-pink-300 hover:border-pink-500 bg-white flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-lg">
                  <div className="text-pink-400 group-hover:text-pink-600 transition-colors">
                    {CATEGORY_ICONS[globalIndex] || <Sparkles className="w-10 h-10" />}
                  </div>
                </div>

                {/* Label */}
                <p className="mt-3 text-center text-gray-700 font-semibold text-xs md:text-sm line-clamp-2 group-hover:text-pink-500 transition-colors w-full px-1">
                  {category.name}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
