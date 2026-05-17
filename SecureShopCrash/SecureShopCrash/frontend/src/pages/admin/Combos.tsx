import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Power } from "lucide-react";
import { toast } from "react-toastify";
import { api } from "../../utils/axiosConfig";
import type { Combo } from "../../types/types";
import ComboModal from "../../components/admin-modal/ComboModal";


const Combos: React.FC = () => {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCombo, setEditingCombo] = useState<Combo | null>(null);

  useEffect(() => {
    fetchCombos();
  }, []);

  const fetchCombos = async () => {
    try {
      setLoading(true);
      const { data } = await api.get<Combo[]>("/combos/all");
      setCombos(data);
    } catch (error) {
      toast.error("Không thể tải danh sách Combo");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCombo(null);
    setIsModalOpen(true);
  };

  const handleEdit = (combo: Combo) => {
    setEditingCombo(combo);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa Combo này không?")) return;
    try {
      await api.delete(`/combos/${id}`);
      toast.success("Xóa Combo thành công");
      fetchCombos();
    } catch (error) {
      toast.error("Không thể xóa Combo");
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await api.patch(`/combos/${id}/toggle`);
      toast.success("Cập nhật trạng thái thành công");
      fetchCombos();
    } catch (error) {
      toast.error("Lỗi cập nhật trạng thái");
    }
  };

  const filteredCombos = combos.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản Lý Combo</h1>
        <button
          onClick={handleCreate}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tạo Combo Mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Tìm kiếm combo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Hình ảnh</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Tên Combo</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Giá trị</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Sản phẩm</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Thời gian</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Trạng thái</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredCombos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Không tìm thấy Combo nào.
                  </td>
                </tr>
              ) : (
                filteredCombos.map((combo) => (
                  <tr key={combo.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <img src={combo.thumbnailUrl} alt={combo.name} className="w-16 h-16 object-cover rounded-md shadow-sm" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{combo.name}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">{combo.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      {combo.fixedPrice ? (
                        <span className="font-bold text-pink-600">{combo.fixedPrice.toLocaleString("vi-VN")} đ</span>
                      ) : (
                        <span className="font-bold text-pink-600">Giảm {combo.discountPercent}%</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {combo.items.length} món
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>Từ: {new Date(combo.startTime).toLocaleDateString("vi-VN")}</div>
                      <div>Đến: {new Date(combo.endTime).toLocaleDateString("vi-VN")}</div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(combo.id)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          combo.active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <Power className="w-3 h-3 mr-1" />
                        {combo.active ? "Đang bật" : "Đã tắt"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(combo)}
                        className="text-blue-600 hover:text-blue-800 p-2"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(combo.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                        title="Xóa"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ComboModal
          combo={editingCombo}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchCombos}
        />
      )}
    </div>
  );
};

export default Combos;
