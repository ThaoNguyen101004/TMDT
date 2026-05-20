import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Shield, Clock, CheckCircle, Calendar, FileText, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { WarrantyRequestApi } from '../../utils/api';
import type { WarrantyRequest } from '../../types/types';

interface WarrantyRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  warrantyRequest?: WarrantyRequest;
  onSuccess: () => void;
}

const WarrantyRequestModal: React.FC<WarrantyRequestModalProps> = ({
  isOpen,
  onClose,
  warrantyRequest,
  onSuccess,
}) => {
  const isCreateMode = !warrantyRequest;
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    issueType: '',
    description: '',
    quantity: 1,
    status: 'SUBMITTED',
    orderItemId: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (warrantyRequest) {
        setFormData({
          issueType: warrantyRequest.issueType,
          description: warrantyRequest.description,
          quantity: warrantyRequest.quantity,
          status: warrantyRequest.status,
          orderItemId: ''
        });
      } else {
        setFormData({
          issueType: '',
          description: '',
          quantity: 1,
          status: 'SUBMITTED',
          orderItemId: ''
        });
      }
    }
  }, [isOpen, warrantyRequest]);

  const handleSave = async () => {
    if (!formData.issueType || !formData.description) {
      toast.error('Vui lòng điền đầy đủ loại vấn đề và mô tả');
      return;
    }

    setIsUpdating(true);
    try {
      if (isCreateMode) {
        if (!formData.orderItemId) {
          toast.error('Vui lòng nhập Order Item ID');
          setIsUpdating(false);
          return;
        }
        await WarrantyRequestApi.createWarrantyRequest({
          orderItemId: formData.orderItemId,
          issueType: formData.issueType,
          description: formData.description,
          quantity: formData.quantity
        });
        toast.success('Tạo yêu cầu bảo hành thành công!');
      } else {
        if (formData.status !== warrantyRequest!.status) {
          if (formData.status === 'ACCEPTED') {
            await WarrantyRequestApi.approveWarrantyRequest(warrantyRequest!.id);
          } else if (formData.status === 'REJECTED') {
            await WarrantyRequestApi.rejectWarrantyRequest(warrantyRequest!.id);
          } else if (['REPAIRED', 'REPLACED', 'RETURNED'].includes(formData.status)) {
            await WarrantyRequestApi.resolveWarrantyRequest(warrantyRequest!.id);
          } else {
            await WarrantyRequestApi.updateWarrantyRequest(warrantyRequest!.id, { 
              issueType: formData.issueType,
              description: formData.description,
              status: formData.status 
            });
          }
        } else {
          // Just update text fields if status unchanged
          await WarrantyRequestApi.updateWarrantyRequest(warrantyRequest!.id, { 
            issueType: formData.issueType,
            description: formData.description
          });
        }
        toast.success('Cập nhật thành công!');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving warranty request:', error);
      toast.error('Có lỗi xảy ra khi lưu');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!warrantyRequest) return;
    if (!window.confirm('Bạn có chắc chắn muốn xóa yêu cầu bảo hành này không?')) return;

    setIsDeleting(true);
    try {
      await WarrantyRequestApi.deleteWarrantyRequest(warrantyRequest.id);
      toast.success('Đã xóa thành công!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Có lỗi xảy ra khi xóa');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusOptions = () => {
    return [
      { value: 'SUBMITTED', label: 'Đã gửi' },
      { value: 'ACCEPTED', label: 'Đã chấp nhận' },
      { value: 'REJECTED', label: 'Từ chối' },
      { value: 'REPAIRED', label: 'Đã sửa chữa' },
      { value: 'REPLACED', label: 'Đã thay thế' },
      { value: 'RETURNED', label: 'Đã trả lại' },
    ];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-500">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isCreateMode ? 'Thêm Yêu cầu Bảo hành' : 'Chi tiết Yêu cầu Bảo hành'}
              </h2>
              {!isCreateMode && <p className="text-sm text-gray-500">#{warrantyRequest?.id}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại vấn đề</label>
              <input 
                type="text" 
                value={formData.issueType}
                onChange={e => setFormData({...formData, issueType: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                placeholder="VD: Lỗi phần mềm..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={isCreateMode}
              >
                {getStatusOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isCreateMode && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Item ID</label>
                <input 
                  type="text" 
                  value={formData.orderItemId}
                  onChange={e => setFormData({...formData, orderItemId: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="ID của sản phẩm trong đơn hàng..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                <input 
                  type="number" 
                  min="1"
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
            <textarea 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
              placeholder="Mô tả chi tiết lỗi..."
            />
          </div>

          {!isCreateMode && warrantyRequest && (
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Thông tin sản phẩm</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Sản phẩm:</span>
                  <p className="text-gray-700">{warrantyRequest.product?.name || 'N/A'}</p>
                  <p className="text-gray-500 text-xs">SKU: {warrantyRequest.product?.sku || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium">Số lượng:</span>
                  <p className="text-gray-700">{warrantyRequest.quantity}</p>
                  <p className="text-gray-500 text-xs">Đơn giá: {(warrantyRequest.unitPrice || 0).toLocaleString('vi-VN')}₫</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 mt-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Yêu cầu: {formatDate(warrantyRequest.requestedAt)}
                </span>
                {warrantyRequest.resolvedAt && (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Giải quyết: {formatDate(warrantyRequest.resolvedAt)}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between p-6 border-t border-gray-200">
          <div>
            {!isCreateMode && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-2"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Xóa Yêu cầu
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isCreateMode ? 'Tạo mới' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarrantyRequestModal;
