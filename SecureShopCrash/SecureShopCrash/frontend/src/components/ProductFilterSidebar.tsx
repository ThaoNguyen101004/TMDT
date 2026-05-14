import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import type { Brand, CategorySummary } from '../types/types';
import { categoryApi, brandApi } from '../utils/api';

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export interface FilterState {
  categories: number[];
  brands: number[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy: string;
}

const ProductFilterSidebar: React.FC<FilterSidebarProps> = ({
  onFilterChange,
  isMobile = false,
  onClose,
}) => {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    sortBy: 'name,asc',
  });

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    brand: true,
    stock: true,
  });

  const [localMinPrice, setLocalMinPrice] = useState('');
  const [localMaxPrice, setLocalMaxPrice] = useState('');

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          categoryApi.getAll(),
          brandApi.getAll(),
        ]);
        setCategories(catRes.content || catRes);
        setBrands(brandRes.content || brandRes);
      } catch (error) {
        console.error('Error loading filters:', error);
      }
    };
    loadFilters();
  }, []);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (categoryId: number) => {
    const updated = filters.categories.includes(categoryId)
      ? filters.categories.filter((id) => id !== categoryId)
      : [...filters.categories, categoryId];

    const newFilters = { ...filters, categories: updated };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleBrandChange = (brandId: number) => {
    const updated = filters.brands.includes(brandId)
      ? filters.brands.filter((id) => id !== brandId)
      : [...filters.brands, brandId];

    const newFilters = { ...filters, brands: updated };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = () => {
    const newFilters = {
      ...filters,
      minPrice: localMinPrice ? parseInt(localMinPrice) : undefined,
      maxPrice: localMaxPrice ? parseInt(localMaxPrice) : undefined,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (sort: string) => {
    const newFilters = { ...filters, sortBy: sort };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const newFilters: FilterState = {
      categories: [],
      brands: [],
      sortBy: 'name,asc',
    };
    setFilters(newFilters);
    setLocalMinPrice('');
    setLocalMaxPrice('');
    onFilterChange(newFilters);
  };

  const sidebarContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <h2 className="text-lg font-bold text-gray-900">Bộ Lọc</h2>
        {isMobile && onClose && (
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Sort */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Sắp Xếp</h3>
        <select
          value={filters.sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full p-2 border rounded-lg text-sm bg-white"
        >
          <option value="name,asc">Tên A-Z</option>
          <option value="price,asc">Giá: Thấp → Cao</option>
          <option value="price,desc">Giá: Cao → Thấp</option>
          <option value="createdAt,desc">Mới Nhất</option>
          <option value="rating,desc">Đánh Giá Cao</option>
        </select>
      </div>

      {/* Price Filter */}
      <div>
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full py-2 font-semibold text-gray-900"
        >
          <span>Khoảng Giá</span>
          {expandedSections.price ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {expandedSections.price && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Từ:</label>
              <input
                type="number"
                value={localMinPrice}
                onChange={(e) => setLocalMinPrice(e.target.value)}
                placeholder="0"
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Đến:</label>
              <input
                type="number"
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(e.target.value)}
                placeholder="10000000"
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            <button
              onClick={handlePriceChange}
              className="w-full bg-purple-600 text-white py-2 rounded font-semibold text-sm hover:bg-purple-700 transition-colors"
            >
              Áp Dụng
            </button>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full py-2 font-semibold text-gray-900"
        >
          <span>Danh Mục</span>
          {expandedSections.category ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {expandedSections.category && (
          <div className="mt-3 space-y-2">
            {categories.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.categories.includes(cat.id)}
                  onChange={() => handleCategoryChange(cat.id)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700 group-hover:text-purple-600 transition-colors">
                  {cat.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Brand Filter */}
      <div>
        <button
          onClick={() => toggleSection('brand')}
          className="flex items-center justify-between w-full py-2 font-semibold text-gray-900"
        >
          <span>Thương Hiệu</span>
          {expandedSections.brand ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {expandedSections.brand && (
          <div className="mt-3 space-y-2">
            {brands.slice(0, 8).map((brand) => (
              <label
                key={brand.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand.id)}
                  onChange={() => handleBrandChange(brand.id)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700 group-hover:text-purple-600 transition-colors">
                  {brand.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="w-full py-2 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
      >
        Xóa Tất Cả Bộ Lọc
      </button>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-white overflow-y-auto">
          <div className="p-4">{sidebarContent}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      {sidebarContent}
    </div>
  );
};

export default ProductFilterSidebar;
