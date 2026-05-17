import React, { useState, useEffect } from "react";
import { X, Search, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { api } from "../../utils/axiosConfig";
import type { Combo, ProductSummary } from "../../types/types";

interface ComboModalProps {
  combo: Combo | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ComboModal: React.FC<ComboModalProps> = ({ combo, onClose, onSuccess }) => {
  const [name, setName] = useState(combo?.name || "");
  const [description, setDescription] = useState(combo?.description || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(combo?.thumbnailUrl || "");
  const [pricingType, setPricingType] = useState<"fixed" | "percent">(
    combo?.fixedPrice ? "fixed" : "percent"
  );
  const [fixedPrice, setFixedPrice] = useState(combo?.fixedPrice?.toString() || "");
  const [discountPercent, setDiscountPercent] = useState(
    combo?.discountPercent?.toString() || ""
  );
  const [startTime, setStartTime] = useState(
    combo ? new Date(combo.startTime).toISOString().slice(0, 16) : ""
  );
  const [endTime, setEndTime] = useState(
    combo ? new Date(combo.endTime).toISOString().slice(0, 16) : ""
  );
  const [items, setItems] = useState<{ product: ProductSummary; quantity: number }[]>(
    combo?.items || []
  );
  const [active, setActive] = useState(combo ? combo.active : true);

  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products?active=true&size=1000");
      setProducts(data.content || data);
    } catch (error) {
      toast.error("Không thể tải danh sách sản phẩm");
    }
  };

  const handleAddItem = (product: ProductSummary) => {
    if (items.find((i) => i.product.id === product.id)) {
      toast.warning("Sản phẩm đã có trong Combo");
      return;
    }
    setItems([...items, { product, quantity: 1 }]);
    setSearchTerm("");
  };

  const handleRemoveItem = (productId: string) => {
    setItems(items.filter((i) => i.product.id !== productId));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(
      items.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Combo phải có ít nhất 1 sản phẩm");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name,
        description,
        thumbnailUrl,
        fixedPrice: pricingType === "fixed" ? Number(fixedPrice) : null,
        discountPercent: pricingType === "percent" ? Number(discountPercent) : null,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        active,
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      };

      if (combo) {
        await api.put(`/combos/${combo.id}`, payload);
        toast.success("Cập nhật Combo thành công");
      } else {
        await api.post("/combos", payload);
        toast.success("Tạo Combo thành công");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !items.find((i) => i.product.id === p.id)
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-8">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">
            {combo ? "Chỉnh sửa Combo" : "Tạo Combo Mới"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row h-full max-h-[70vh]">
          {/* Cột trái: Thông tin Combo */}
          <div className="flex-1 p-6 border-r border-gray-100 overflow-y-auto space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên Combo *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                placeholder="VD: Combo Skincare Mùa Hè"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                placeholder="Mô tả về combo..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hình ảnh (URL) *
              </label>
              <input
                type="url"
                required
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                placeholder="https://..."
              />
              {thumbnailUrl && (
                <div className="mt-2">
                  <img src={thumbnailUrl} alt="Preview" className="h-24 w-24 object-cover rounded-lg border border-gray-200" onError={(e) => e.currentTarget.style.display = 'none'} />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại giá *
                </label>
                <select
                  value={pricingType}
                  onChange={(e) => setPricingType(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="fixed">Giá cố định</option>
                  <option value="percent">Giảm theo %</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {pricingType === "fixed" ? "Giá Combo (VNĐ) *" : "Phần trăm giảm (%) *"}
                </label>
                {pricingType === "fixed" ? (
                  <input
                    type="number"
                    required
                    min="0"
                    value={fixedPrice}
                    onChange={(e) => setFixedPrice(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                ) : (
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian bắt đầu *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian kết thúc *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="active"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
              />
              <label htmlFor="active" className="ml-2 text-sm font-medium text-gray-700">
                Kích hoạt ngay
              </label>
            </div>
          </div>

          {/* Cột phải: Chọn sản phẩm */}
          <div className="flex-1 p-6 flex flex-col overflow-hidden bg-gray-50/50">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center justify-between">
              <span>Sản phẩm trong Combo ({items.length})</span>
            </h3>

            {/* List selected items */}
            <div className="flex-1 overflow-y-auto mb-4 border border-gray-200 rounded-lg bg-white divide-y divide-gray-100 min-h-[200px]">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
                  <Search className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm text-center">Chưa có sản phẩm nào.<br/>Tìm và thêm ở bên dưới.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex items-center p-3 hover:bg-gray-50">
                    <img src={item.product.thumbnailUrl} alt="" className="w-10 h-10 object-cover rounded mr-3 border border-gray-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                      <p className="text-xs text-pink-600 font-semibold">{item.product.price.toLocaleString("vi-VN")} đ</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.product.id, Number(e.target.value))}
                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.product.id)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Search products to add */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm sản phẩm để thêm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 bg-white"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />

              {searchTerm && (
                <div className="absolute bottom-full left-0 right-0 mb-1 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl z-10 divide-y divide-gray-100">
                  {filteredProducts.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500 text-center">Không tìm thấy sản phẩm.</div>
                  ) : (
                    filteredProducts.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center p-2 hover:bg-pink-50 cursor-pointer"
                        onClick={() => handleAddItem(p)}
                      >
                        <img src={p.thumbnailUrl} alt="" className="w-8 h-8 object-cover rounded mr-2" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                        </div>
                        <Plus className="w-4 h-4 text-pink-600 ml-2" />
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Footer Buttons */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white flex justify-end space-x-3 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium shadow-sm transition-all disabled:opacity-70 flex items-center"
            >
              {isSubmitting ? "Đang xử lý..." : combo ? "Lưu thay đổi" : "Tạo Combo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComboModal;
