import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  ShoppingCart,
  Heart,
  Star,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  CheckCircle,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { cartService } from "../utils/cartService";
import { useAppSelector } from "../hooks";
import { productApi, ReviewApi } from "../utils/api";
import { api } from "../utils/axiosConfig";
import { wishlistService } from "../utils/wishlistService";
import type { ProductDetail, Review, Combo } from "../types/types";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const [filterRating, setFilterRating] = useState<number | null>(null);

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const userRole: "guest" | "user" | "admin" =
    isAuthenticated && user
      ? (user.role.toLowerCase() as "user" | "admin")
      : "guest";

  const fetchProductDetails = async (productId: string) => {
    try {
      setLoading(true);
      const [response, reviewsData, combosRes] = await Promise.all([
        productApi.getById(productId),
        ReviewApi.getReviewsByProduct(productId),
        api.get(`/combos/product/${productId}`),
      ]);

      const baseProduct = {
        ...response,
        features: [] as string[],
        specifications: {} as Record<string, string>,
      };

      switch (response.category?.id) {
        case 1:
          baseProduct.features = [
            "Son môi mang đến màu sắc tự nhiên cùng chất son mềm mịn, giúp đôi môi trông tươi tắn hơn trong nhiều phong cách trang điểm khác nhau. Công thức bổ sung thành phần dưỡng giúp hạn chế tình trạng khô môi và bong tróc khi sử dụng trong thời gian dài. Thiết kế nhỏ gọn, tiện lợi để mang theo khi đi học, đi làm hoặc du lịch.",
          ];
          break;


        case 2:
          baseProduct.features = [
            "Kem chống nắng giúp hỗ trợ bảo vệ da trước tác động của tia UV và môi trường bên ngoài, đồng thời hạn chế cảm giác khô ráp do tiếp xúc với ánh nắng. Chất kem mỏng nhẹ, dễ tán đều trên da và không để lại cảm giác nặng mặt khi sử dụng. Sản phẩm phù hợp dùng hằng ngày trước khi ra ngoài hoặc trước các bước trang điểm.",
          ];
          break;

        case 3:
          baseProduct.features = [
            "Sản phẩm giúp làm sạch bụi bẩn, dầu thừa và cặn trang điểm trên da sau một ngày dài mà không gây khô căng khó chịu. Kết cấu tạo bọt nhẹ giúp mang lại cảm giác sạch thoáng nhưng vẫn giữ được độ ẩm tự nhiên cho da. Phù hợp sử dụng mỗi ngày cho cả da thường, da hỗn hợp và da nhạy cảm.",
          ];
          break;


        case 4:
          baseProduct.features = [
            "Tinh chất chứa các thành phần hỗ trợ cải thiện làn da xỉn màu, giúp da trông tươi sáng và rạng rỡ hơn sau thời gian sử dụng. Công thức dịu nhẹ, dễ thẩm thấu, không gây bết dính và có thể kết hợp trong nhiều chu trình skincare khác nhau. Phù hợp với những ai muốn chăm sóc da theo hướng căng bóng và khỏe mạnh tự nhiên.",
          ];
          break;


        case 5:
          baseProduct.features = [
            "Sản phẩm giúp cấp ẩm chuyên sâu, hỗ trợ làm dịu và phục hồi làn da khô ráp do tác động từ môi trường và thời tiết. Với kết cấu mỏng nhẹ, kem dễ dàng thẩm thấu vào da mà không gây cảm giác nhờn rít. Phù hợp sử dụng hằng ngày cho nhiều loại da, đặc biệt là da thiếu ẩm hoặc thường xuyên tiếp xúc với điều hòa và ánh nắng."
          ];
          break;


        default:
          baseProduct.features = [
            "Son môi mang đến màu sắc tự nhiên cùng chất son mềm mịn, giúp đôi môi trông tươi tắn hơn trong nhiều phong cách trang điểm khác nhau. Công thức bổ sung thành phần dưỡng giúp hạn chế tình trạng khô môi và bong tróc khi sử dụng trong thời gian dài. Thiết kế nhỏ gọn, tiện lợi để mang theo khi đi học, đi làm hoặc du lịch.",
          ];
          baseProduct.specifications = {
            "Bảo hành": "12 tháng chính hãng",
            "Giao hàng": "Toàn quốc 24-48h",
            "Đổi trả": "Miễn phí trong 30 ngày đầu",
          };
          break;
      }

      setProduct(baseProduct);
      setReviews(reviewsData || []);
      setIsWishlisted(wishlistService.isInWishlist(productId));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      setSelectedImage(0);
      setQuantity(1);
      fetchProductDetails(id);
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleQuantityChange = (change: number) => {
    if (!product) return;

    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.availableStock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    window.dispatchEvent(
      new CustomEvent('requestAddToCart', {
        detail: { product, quantity }
      })
    );
  };



  const handleBuyNow = async () => {
    if (userRole === "guest") {
      toast.info("Vui lòng đăng nhập để mua hàng!");
      navigate("/login");
      return;
    }

    if (!product) return;

    navigate("/checkout", { state: { product, quantity } });
  };

  const handleWishlist = () => {
    if (!product) return;
    const added = wishlistService.toggle(product);
    setIsWishlisted(added);
  };

  // Filter reviews by rating
  const filteredReviews = reviews.filter((r) => {
    if (filterRating && r.rating !== filterRating) return false;
    if (userRole !== "admin" && r.status !== "APPROVED") return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
            {/* Left skeleton */}
            <div className="space-y-4">
              <div className="w-full h-96 bg-gray-200 rounded-lg"></div>
              <div className="flex space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded"></div>
                <div className="w-20 h-20 bg-gray-200 rounded"></div>
                <div className="w-20 h-20 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Right skeleton */}
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
            {/* Left skeleton */}
            <div className="space-y-4">
              <div className="w-full h-96 bg-gray-200 rounded-lg"></div>
              <div className="flex space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded"></div>
                <div className="w-20 h-20 bg-gray-200 rounded"></div>
                <div className="w-20 h-20 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Right skeleton */}
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="text-gray-700 hover:text-purple-600">
                Trang chủ
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link
                  to="/products"
                  className="text-gray-700 hover:text-purple-600"
                >
                  Sản phẩm
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">{product.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={
                  product.mediaAssets[selectedImage]?.url ||
                  product.thumbnailUrl
                }
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex space-x-4">
              {product.mediaAssets?.length ? (
                product.mediaAssets.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === index
                      ? "border-purple-600"
                      : "border-gray-200"
                      }`}
                  >
                    <img
                      src={image?.url || product.thumbnailUrl}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))
              ) : (
                <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                  <img
                    src={product.thumbnailUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-cyan-500 font-medium uppercase tracking-wide">
                    {product.category.name}
                  </span>
                  {product.brand && (
                    <span className="text-sm text-purple-600 font-semibold bg-purple-50 px-3 py-1 rounded-full">
                      {product.brand.name}
                    </span>
                  )}
                </div>
              </div>
              <h1 className="text-3xl font-bold text-zinc-800 mt-2">
                {product.name}
              </h1>

              <div className="flex items-center mt-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 ml-2">
                  {product.rating} ({product.reviewCount} đánh giá)
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-purple-600">
                {formatPrice(product.price)}
              </span>
              {product.listedPrice && product.listedPrice > product.price && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.listedPrice)}
                  </span>
                  <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded text-sm font-medium">
                    -
                    {Math.round(
                      ((product.listedPrice - product.price) /
                        product.listedPrice) *
                      100
                    )}
                    %
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <span
                className={`flex items-center ${product.inStock ? "text-green-600" : "text-red-600"
                  }`}
              >
                {product.inStock ? (
                  <CheckCircle className="h-5 w-5 mr-2" />
                ) : null}
                {product.inStock ? "Còn hàng" : "Hết hàng"}
              </span>
              {product.inStock && (
                <span className="text-gray-600">
                  Còn {product.availableStock} sản phẩm
                </span>
              )}
            </div>

            <p className="text-gray-700 leading-relaxed">{product.longDesc}</p>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="font-medium text-gray-900">Số lượng:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-2 hover:bg-gray-50 disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 text-center min-w-[3rem]">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-2 hover:bg-gray-50 disabled:opacity-50"
                  disabled={quantity >= product.availableStock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {product.inStock ? (
                <>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-gray-100 text-zinc-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Thêm vào giỏ hàng
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Mua ngay
                  </button>
                </>
              ) : (
                <div className="w-full bg-gray-200 text-gray-600 px-6 py-3 rounded-lg text-center font-medium cursor-not-allowed">
                  Hết hàng
                </div>
              )}

              {/* Wishlist luôn hoạt động */}
              <button
                onClick={handleWishlist}
                className={`p-3 rounded-lg border ${isWishlisted
                  ? "bg-pink-50 border-pink-200 text-pink-600"
                  : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <Heart
                  className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
                />
              </button>
            </div>

            {/* Features */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-zinc-800 mb-4">
                Mô tả sản phẩm
              </h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Shipping Info */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center text-gray-700">
                <Truck className="h-5 w-5 text-cyan-500 mr-3" />
                <span>Giao hàng toàn quốc trong 24-48h</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Shield className="h-5 w-5 text-purple-500 mr-3" />
                <span>Bảo hành chính hãng 2 năm</span>
              </div>
              <div className="flex items-center text-gray-700">
                <RotateCcw className="h-5 w-5 text-pink-500 mr-3" />
                <span>Đổi trả miễn phí trong 30 ngày</span>
              </div>
            </div>
          </motion.div>
        </div>



        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-zinc-800">
              Đánh giá từ khách hàng ({filteredReviews.length})
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <div className="flex items-center mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-zinc-800">
                  {product.rating}
                </span>
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700">Lọc theo:</span>
            <button
              onClick={() => setFilterRating(null)}
              className={`px-3 py-1 rounded-full text-sm ${filterRating === null
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              Tất cả
            </button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => setFilterRating(rating)}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${filterRating === rating
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {rating} <Star className="h-3 w-3 fill-current" />
              </button>
            ))}
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  {filterRating
                    ? `Chưa có đánh giá ${filterRating} sao nào`
                    : "Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!"}
                </p>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white border border-gray-200 rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-zinc-800">
                            {review.userName}
                          </span>
                        </div>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                                }`}
                            />
                          ))}
                          <span className="text-sm text-gray-500 ml-2">
                            {new Date(review.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </main>
      <Footer />


    </div>
  );
};

export default ProductDetails;
