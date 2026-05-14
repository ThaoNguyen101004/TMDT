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

const FeaturedCategories: React.FC = () => {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAll();
        const cats = res.content || res;
        setCategories(cats.slice(0, 21));
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 uppercase tracking-wider">
            Danh Mục Nổi Bật
          </h2>
        </div>

        {/* Categories Circle Grid */}
        <div className="flex flex-wrap justify-start gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group flex flex-col items-center"
            >
              {/* Circle with Pink Border */}
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-pink-300 hover:border-pink-400 bg-white flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg">
                <div className="text-pink-400 group-hover:text-pink-500 transition-colors">
                  {CATEGORY_ICONS[index + 1] || <Sparkles className="w-10 h-10" />}
                </div>
              </div>
              
              {/* Label */}
              <p className="mt-3 text-center text-gray-700 font-semibold text-sm md:text-base line-clamp-2 hover:text-pink-500 transition-colors w-24 md:w-28">
                {category.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
