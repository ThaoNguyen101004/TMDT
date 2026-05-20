import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, MessageSquare, Clock, CheckCircle, User, Calendar, FileText, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { SupportTicketApi, userApi } from '../../utils/api';
import type { SupportTicket } from '../../types/types';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket?: SupportTicket;
  onSuccess: () => void;
}

const TicketModal: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onSuccess,
}) => {
  const isCreateMode = !ticket;
  const [userName, setUserName] = useState<string>('Đang tải...');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    content: '',
    status: 'OPEN'
  });

  useEffect(() => {
    if (isOpen) {
      if (ticket) {
        setFormData({
          title: ticket.title,
          subject: ticket.subject,
          content: ticket.content,
          status: ticket.status
        });
        loadUserName(ticket.userId);
      } else {
        setFormData({
          title: '',
          subject: '',
          content: '',
          status: 'OPEN'
        });
      }
    }
  }, [isOpen, ticket]);

  const loadUserName = async (userId: string) => {
    try {
      const user = await userApi.getUserById(userId);
      setUserName(user.name || user.email || 'Không rõ');
    } catch (error) {
      console.error('Error loading user name:', error);
      setUserName('Không thể tải tên người dùng');
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.subject || !formData.content) {
      toast.error('Vui lòng điền đầy đủ thông tin (Tiêu đề, Chủ đề, Nội dung)');
      return;
    }

    setIsUpdating(true);
    try {
      if (isCreateMode) {
        // Create new ticket
        await SupportTicketApi.createTicket({
          title: formData.title,
          subject: formData.subject,
          content: formData.content
        });
        toast.success('Tạo ticket thành công!');
      } else {
        // Update ticket
        await SupportTicketApi.updateTicket(ticket!.id, {
          title: formData.title,
          subject: formData.subject,
          content: formData.content
        });
        if (formData.status !== ticket!.status) {
          await SupportTicketApi.updateTicketStatus(ticket!.id, formData.status);
        }
        toast.success('Cập nhật ticket thành công!');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving ticket:', error);
      toast.error('Có lỗi xảy ra khi lưu ticket');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!ticket) return;
    if (!window.confirm('Bạn có chắc chắn muốn xóa ticket này không? Hành động này không thể hoàn tác.')) return;

    setIsDeleting(true);
    try {
      await SupportTicketApi.deleteTicket(ticket.id);
      toast.success('Đã xóa ticket thành công!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast.error('Có lỗi xảy ra khi xóa ticket');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusOptions = () => {
    return [
      { value: 'OPEN', label: 'Mới' },
      { value: 'IN_PROGRESS', label: 'Đang xử lý' },
      { value: 'RESOLVED', label: 'Đã giải quyết' },
      { value: 'CLOSED', label: 'Đã đóng' },
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
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-500 to-cyan-500">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isCreateMode ? 'Thêm Ticket Hỗ trợ' : 'Chi tiết Ticket Hỗ trợ'}
              </h2>
              {!isCreateMode && <p className="text-sm text-gray-500">#{ticket.id}</p>}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
                placeholder="Nhập tiêu đề..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chủ đề</label>
              <input 
                type="text" 
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
                placeholder="Nhập chủ đề..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isCreateMode} // New tickets are OPEN by default on server
            >
              {getStatusOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
            <textarea 
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder="Mô tả chi tiết..."
            />
          </div>

          {!isCreateMode && (
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <div className="flex items-center gap-3 mb-3">
                <User className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Thông tin khách hàng</span>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Tên người dùng:</span> {userName}</p>
                <p className="text-gray-500 text-xs">User ID: {ticket.userId}</p>
                <p className="text-gray-500 text-xs mt-2 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Tạo lúc: {formatDate(ticket.createdAt)}
                </p>
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
                Xóa Ticket
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
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
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

export default TicketModal;
