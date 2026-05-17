import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import ProductFilterSidebar, { type FilterState } from "../components/ProductFilterSidebar";
import {
  Filter,
  Search,
  Grid,
  List,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cartService } from "../utils/cartService";
import type { Brand, CategorySummary, ProductSummary } from "../types/types";
import { brandApi, categoryApi, productApi } from "../utils/api";
import type { ProductQueryParams } from "../types/query";
import Pagination from "../components/Pagination";
import SkeletonCard from "../components/SkeletonCard";
import { useUIConfig } from "../stores/uiConfigStore";

const COLS_CLASS: Record<number, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

const Products: React.FC = () => {
  const { state } = useLocation();
  const { keyword } = state || {};
  const { config } = useUIConfig();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();

  // === States ===
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(keyword || "");
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const param = searchParams.get("category");
    return param ? parseInt(param) : 0;
  });
  const [selectedBrand, setSelectedBrand] = useState<number>(() => {
    const param = searchParams.get("brand");
    return param ? parseInt(param) : 0;
  });
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(true);

  // === Price filter states ===
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [tempMinPrice, setTempMinPrice] = useState<string>("");
  const [tempMaxPrice, setTempMaxPrice] = useState<string>("");

  // === Stock filter state ===
  const [stockFilter, setStockFilter] = useState<
    "all" | "inStock" | "outOfStock"
  >("all");

  // === Show all categories/brands ===
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);

  // === Filter state for ProductFilterSidebar ===
  const [filterState, setFilterState] = useState<FilterState>({
    categories: [],
    brands: [],
    minPrice: 0,
    maxPrice: Number.MAX_VALUE,
    inStock: false,
    sortBy: "name"
  });

  // === Pagination (reads defaults from UIConfig) ===
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(config.productsPage.pageSize);

  // === Fetch products ===
  const fetchProducts = useCallback(
    async (filters: ProductQueryParams = {}, signal?: AbortSignal) => {
      try {
        setLoading(true);

        let inStock: boolean | undefined = undefined;
        if (filters.stockFilter === "inStock") inStock = true;
        else if (filters.stockFilter === "outOfStock") inStock = false;

        const response = await productApi.getAll({
          active: filters.active ?? true,
          categoryId: filters.categoryId || undefined,
          brandId: filters.brandId || undefined,
          keyword: filters.keyword,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          inStock,
          page: filters.page ?? 0,
          size: filters.size ?? pageSize,
          sort: filters.sort ?? "name,asc",
        });

        if (signal?.aborted) return;

        setProducts(response.content);
        setTotalPages(response.page.totalPages);
        setTotalElements(response.page.totalElements);
      } catch (error: any) {
        if (error.name === "AbortError" || error.name === "CanceledError")
          return;
        setProducts([]);
        setTotalPages(0);
        setTotalElements(0);
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [pageSize]
  );

  const fetchFilters = async () => {
    return Promise.all([categoryApi.getAll(), brandApi.getAll()]);
  };

  useEffect(() => {
    fetchFilters()
      .then(([categoriesRes, brandsRes]) => {
        setCategories([
          { id: 0, name: "Tất cả" } as CategorySummary,
          ...categoriesRes,
        ]);
        setBrands([{ id: 0, name: "Tất cả" }, ...(brandsRes?.content ?? [])]);
      })
      .catch(() => {})
      .finally(() => setLoadingFilters(false));
  }, []);

  // === Load products (debounce + abort) ===
  useEffect(() => {
    // Đợi filters load xong
    if (loadingFilters) return;

    const abortController = new AbortController();

    const timer = setTimeout(
      () => {
        const params: any = {
          page,
          stockFilter: stockFilter || "all",
        };

        // Chỉ thêm minPrice/maxPrice nếu có giá trị
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;

        if (selectedCategory && selectedCategory !== 0)
          params.categoryId = selectedCategory;
        if (selectedBrand && selectedBrand !== 0)
          params.brandId = selectedBrand;
        if (searchTerm.trim()) params.keyword = searchTerm.trim();

        switch (sortBy) {
          case "price-low":
            params.sort = "price,asc";
            break;
          case "price-high":
            params.sort = "price,desc";
            break;
          case "rating":
            params.sort = "rating,desc";
            break;
          default:
            params.sort = "name,asc";
        }

        fetchProducts(params, abortController.signal);
      },
      searchTerm !== keyword ? 500 : 0
    );

    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [
    loadingFilters,
    selectedCategory,
    selectedBrand,
    searchTerm,
    sortBy,
    page,
    minPrice,
    maxPrice,
    stockFilter,
    fetchProducts,
    keyword,
  ]);

  // === Handle filter actions ===
  const handleApplyPriceFilter = () => {
    if (tempMinPrice && tempMaxPrice) {
      const min = parseFloat(tempMinPrice);
      const max = parseFloat(tempMaxPrice);
      if (min > max) return alert("Giá tối thiểu không thể lớn hơn giá tối đa");
    }
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
    setPage(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetPriceFilter = () => {
    setMinPrice("");
    setMaxPrice("");
    setTempMinPrice("");
    setTempMaxPrice("");
    setPage(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStockFilterChange = (
    filter: "all" | "inStock" | "outOfStock"
  ) => {
    setStockFilter(filter);
    setPage(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // === Filter state handler from ProductFilterSidebar ===
  const handleFilterChange = (newFilter: FilterState) => {
    setFilterState(newFilter);
    
    // Update categories
    if (newFilter.categories.length > 0) {
      setSelectedCategory(newFilter.categories[0]);
      searchParams.set("category", newFilter.categories[0].toString());
    } else {
      setSelectedCategory(0);
      searchParams.delete("category");
    }
    
    // Update brands
    if (newFilter.brands.length > 0) {
      setSelectedBrand(newFilter.brands[0]);
      searchParams.set("brand", newFilter.brands[0].toString());
    } else {
      setSelectedBrand(0);
      searchParams.delete("brand");
    }
    
    // Update price
    if ((newFilter.minPrice ?? 0) > 0) setMinPrice(newFilter.minPrice!.toString());
    else setMinPrice("");
    
    if ((newFilter.maxPrice ?? Number.MAX_VALUE) < Number.MAX_VALUE) setMaxPrice(newFilter.maxPrice!.toString());
    else setMaxPrice("");
    
    // Update sort
    setSortBy(newFilter.sortBy);
    
    setSearchParams(searchParams);
    setPage(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (category: number) => {
    setSelectedCategory(category);
    setPage(0);
    if (category === 0) searchParams.delete("category");
    else searchParams.set("category", category.toString());
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBrandChange = (brand: number) => {
    setSelectedBrand(brand);
    setPage(0);
    if (brand === 0) searchParams.delete("brand");
    else searchParams.set("brand", brand.toString());
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = async (product: ProductSummary) => {
    const success = await cartService.addToCart(product);
    if (success) window.dispatchEvent(new Event("cartUpdated"));
  };

  const displayedCategories = showAllCategories
    ? categories
    : categories.slice(0, 6);
  const displayedBrands = showAllBrands ? brands : brands.slice(0, 6);

  return (
    <div className="min-h-screen beauty-shell">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-800 mb-2">
            Bộ sưu tập mỹ phẩm
          </h1>
          <p className="text-gray-600">
            Khám phá bộ sưu tập thiết bị an ninh chất lượng cao với công nghệ
            hiện đại
          </p>
        </div>

        {/* Search & Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search box */}
            <div className="relative w-full lg:flex-1 lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Sort & View controls */}
            <div className="flex items-center gap-2 sm:gap-4 w-full lg:w-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex-1 sm:flex-initial justify-center"
              >
                <Filter className="h-4 w-4" />
                <span className="text-sm">Bộ lọc</span>
              </button>

              <div className="relative inline-block flex-1 sm:flex-initial">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(0);
                  }}
                  className="w-full sm:w-52 px-3 sm:px-4 py-2 bg-white text-gray-700 text-sm rounded-xl border border-gray-200 shadow-sm transition-all duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 appearance-none cursor-pointer"
                >
                  <option value="name">Sắp xếp theo tên</option>
                  <option value="price-low">Giá thấp đến cao</option>
                  <option value="price-high">Giá cao đến thấp</option>
                  <option value="rating">Đánh giá cao nhất</option>
                </select>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              <div className="hidden sm:flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-purple-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-purple-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Filter Sidebar */}
          {!loadingFilters && (
            <div className={`w-full lg:w-64 flex-shrink-0 ${
              showFilters ? "block" : "hidden lg:block"
            }`}>
              <ProductFilterSidebar
                onFilterChange={handleFilterChange}
              />
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                >
                  {[...Array(9)].map((_, index) => (
                    <SkeletonCard key={index} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key={`${selectedCategory}-${page}-${sortBy}-${searchTerm}-${minPrice}-${maxPrice}-${stockFilter}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-600 text-sm sm:text-base">
                      Hiển thị {products.length} / {totalElements} sản phẩm
                    </p>
                  </div>

                  {products.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">
                        Không tìm thấy sản phẩm nào
                      </p>
                    </div>
                  ) : (
                    <>
                      <div
                        className={`grid gap-4 sm:gap-6 ${
                          viewMode === "grid"
                            ? (COLS_CLASS[config.productsPage.columnsPerRow] ?? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")
                            : "grid-cols-1"
                        }`}
                      >
                        {products.map((product, index) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <ProductCard
                              product={product}
                            />
                          </motion.div>
                        ))}
                      </div>

                      <Pagination
                        page={page}
                        totalPages={totalPages}
                        totalElements={totalElements}
                        pageSize={pageSize}
                        onPageChange={(newPage) => {
                          setPage(newPage);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        onPageSizeChange={(newSize) => {
                          setPageSize(newSize);
                          setPage(0);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      />
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;
