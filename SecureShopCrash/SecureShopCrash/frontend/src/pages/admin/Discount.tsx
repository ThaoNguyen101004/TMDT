import React, { useState, useMemo } from "react";
import { Plus, Edit, Percent, Calendar, Search, Zap } from "lucide-react";
import { DiscountApi } from "../../utils/api";
import type { Discount } from "../../types/types";
import DiscountModal from "../../components/admin-modal/DiscountModal";
import { toast } from 'react-toastify';
import { productApi } from "../../utils/api";

type Props = {
  data?: Discount[];
  onReload?: () => void;
};

const Promotions: React.FC<Props> = ({ data, onReload }) => {
  const discounts = data || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [discountModal, setDiscountModal] = useState<{
    open: boolean;
    discount?: Discount;
  }>({ open: false });

  const [globalSaleOpen, setGlobalSaleOpen] = useState(false);
  const [globalSalePercent, setGlobalSalePercent] = useState<number>(0);
  const [globalSaleLoading, setGlobalSaleLoading] = useState(false);

  const filteredDiscounts = useMemo(() => {
    let filtered = discounts;

    // Tìm kiếm theo mã khuyến mãi
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((discount: Discount) =>
        discount.code.toLowerCase().includes(searchLower)
      );
    }

    // Lọc theo trạng thái
    if (statusFilter !== "all") {
      filtered = filtered.filter((discount: Discount) => {
        if (statusFilter === "active") return discount.active;
        if (statusFilter === "inactive") return !discount.active;
        return true;
      });
    }

    return filtered;
  }, [discounts, searchTerm, statusFilter]);

  // const handleDeleteDiscount = (discount: Discount) => {
  //   setConfirmDialog({ open: true, discount });
  // };

  // const confirmDelete = async () => {
  //   if (!confirmDialog.discount) return;

  //   try {
  //     await DiscountApi.delete(confirmDialog.discount.id);
  //     toast.success('Đã xóa khuyến mãi thành công');
  //     setConfirmDialog({ open: false });
  //     onReload?.();
  //   } catch (error: any) {
  //     console.error('Error deleting discount:', error);
  //     if (error.response?.status === 401) {
  //       toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
  //     } else if (error.response?.status === 403) {
  //       toast.error('Bạn không có quyền thực hiện thao tác này.');
  //     } else {
  //       toast.error('Có lỗi xảy ra khi xóa khuyến mãi');
  //     }
  //   }
  // };

  const handleCreateDiscount = () => {
    setDiscountModal({ open: true });
  };

  const handleEditDiscount = (discount: Discount) => {
    setDiscountModal({ open: true, discount });
  };

  const handleDiscountModalSuccess = () => {
    onReload?.();
  };

  const handleApplyGlobalSale = async () => {
    if (globalSalePercent <= 0 || globalSalePercent > 100) {
      toast.error('Phần trăm giảm giá phải từ 1 đến 100');
      return;
    }
    try {
      setGlobalSaleLoading(true);
      await productApi.applyGlobalSale(globalSalePercent);
      toast.success('Đã áp dụng Flash Sale cho toàn bộ sản phẩm!');
      setGlobalSaleOpen(false);
      setGlobalSalePercent(0);
    } catch (error) {
      console.error('Lỗi khi áp dụng Flash Sale:', error);
      toast.error('Có lỗi xảy ra khi áp dụng Flash Sale');
    } finally {
      setGlobalSaleLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-zinc-800">Quản lý khuyến mãi</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setGlobalSaleOpen(true)}
            className="flex items-center gap-2 bg-orange-100 text-orange-600 border border-orange-200 px-4 py-2 rounded-lg hover:bg-orange-200 transition-colors"
          >
            <Zap className="w-4 h-4" />
            <span className="font-medium">Flash Sale Toàn Hệ Thống</span>
          </button>
          <button
            onClick={handleCreateDiscount}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm khuyến mãi</span>
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã khuyến mãi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as "all" | "active" | "inactive")
          }
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredDiscounts.length > 0 ? (
          filteredDiscounts.map((discount: Discount) => (
            <div
              key={discount.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Percent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-800 mb-2">
                      {discount.code}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Percent className="w-4 h-4" />
                        {discount.discountType === "PERCENT"
                          ? `${discount.discountValue}%`
                          : discount.discountType === "FIXED_AMOUNT"
                          ? `${discount.discountValue.toLocaleString("vi-VN")}₫`
                          : "Miễn phí vận chuyển"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(discount.startAt).toLocaleDateString(
                          "vi-VN"
                        )}{" "}
                        - {new Date(discount.endAt).toLocaleDateString("vi-VN")}
                      </span>
                      {discount.minOrderValue > 0 && (
                        <span>
                          Đơn tối thiểu:{" "}
                          {discount.minOrderValue.toLocaleString("vi-VN")}₫
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          discount.active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {discount.active ? "Đang hoạt động" : "Không hoạt động"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditDiscount(discount)}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {/* <button 
                    onClick={() => handleDeleteDiscount(discount)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button> */}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            {searchTerm || statusFilter !== "all"
              ? "Không tìm thấy khuyến mãi phù hợp"
              : "Chưa có khuyến mãi nào"}
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      {/* <ConfirmDialog
        open={confirmDialog.open}
        title="Xác nhận xóa khuyến mãi"
        message={`Bạn có chắc chắn muốn xóa khuyến mãi "${confirmDialog.discount?.code}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa khuyến mãi"
        cancelText="Hủy"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ open: false })}
      /> */}

      {/* Discount Modal */}
      <DiscountModal
        isOpen={discountModal.open}
        onClose={() => setDiscountModal({ open: false })}
        discount={discountModal.discount}
        onSuccess={handleDiscountModalSuccess}
      />

      {/* Global Sale Modal */}
      {globalSaleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-orange-50">
              <h3 className="text-xl font-bold text-orange-700 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Cấu hình Flash Sale Đồng Loạt
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Tính năng này sẽ tự động thay đổi giá bán (price) của TẤT CẢ sản phẩm đang hoạt động trên toàn hệ thống bằng cách giảm % so với giá niêm yết (listedPrice).
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mức giảm giá (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={globalSalePercent}
                    onChange={(e) => setGlobalSalePercent(Number(e.target.value))}
                    className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg font-bold"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <span className="text-gray-500 font-bold">%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button
                onClick={() => setGlobalSaleOpen(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleApplyGlobalSale}
                disabled={globalSaleLoading || globalSalePercent <= 0 || globalSalePercent > 100}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {globalSaleLoading ? 'Đang áp dụng...' : 'Áp dụng ngay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promotions;

export async function loadData() {
  try {
    const result = await DiscountApi.getAll();
    return result.content || result;
  } catch (error) {
    console.error("Error loading discounts:", error);
    return [];
  }
}
