import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Link2, FileText, Eye, EyeOff, Image } from 'lucide-react';
import { toast } from 'react-toastify';
import { ArticleApi } from '../../utils/api';
import type { Article } from '../../types/types';

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article?: Article;
  onSuccess: () => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ isOpen, onClose, article, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    externalUrl: '',
    imageUrl: '',
    active: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!article;

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || '',
        summary: article.summary || '',
        content: article.content || '',
        externalUrl: article.externalUrl || '',
        imageUrl: article.imageUrl || '',
        active: article.active ?? true,
      });
    } else {
      setFormData({ title: '', summary: '', content: '', externalUrl: '', imageUrl: '', active: true });
    }
    setErrors({});
  }, [article, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Tiêu đề không được để trống';
    if (!formData.content.trim() || formData.content.trim().length < 20)
      newErrors.content = 'Nội dung phải có ít nhất 20 ký tự';
    if (formData.externalUrl && !/^https?:\/\/.+/.test(formData.externalUrl.trim()))
      newErrors.externalUrl = 'URL phải bắt đầu bằng http:// hoặc https://';
    if (formData.imageUrl && !/^https?:\/\/.+/.test(formData.imageUrl.trim()))
      newErrors.imageUrl = 'URL ảnh phải bắt đầu bằng http:// hoặc https://';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const payload = {
        title: formData.title.trim(),
        summary: formData.summary.trim() || undefined,
        content: formData.content.trim(),
        externalUrl: formData.externalUrl.trim() || undefined,
        imageUrl: formData.imageUrl.trim() || undefined,
        active: formData.active,
      };
      if (isEditing) {
        await ArticleApi.update(article!.id, payload);
      } else {
        await ArticleApi.create(payload);
      }
      toast.success(isEditing ? 'Cập nhật bài viết thành công!' : 'Thêm bài viết thành công!');
      onSuccess();
      handleClose();
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
      setErrors({ submit: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ title: '', summary: '', content: '', externalUrl: '', imageUrl: '', active: true });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-800">
                {isEditing ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
              </h3>
              <p className="text-xs text-gray-400">
                {isEditing ? `ID: ${article!.id.slice(0, 8)}...` : 'Điền thông tin bài viết bên dưới'}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form id="article-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Tiêu đề */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
              Tiêu đề bài viết <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition ${
                errors.title ? 'border-red-400 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="VD: 5 bí quyết dưỡng da mùa hè hiệu quả nhất"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Tóm tắt */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
              Tóm tắt ngắn
              <span className="text-gray-400 font-normal ml-1">(hiển thị dưới tiêu đề)</span>
            </label>
            <textarea
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none resize-none transition"
              placeholder="Tóm tắt ngắn gọn nội dung bài viết (tùy chọn)"
            />
          </div>

          {/* Nội dung */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
              Nội dung bài viết <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none resize-y transition ${
                errors.content ? 'border-red-400 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="Nội dung đầy đủ của bài viết..."
            />
            {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
          </div>

          {/* Ảnh đại diện */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
              <div className="flex items-center gap-1.5">
                <Image className="w-4 h-4 text-purple-500" />
                Ảnh đại diện
                <span className="text-gray-400 font-normal ml-1">(hiển thị trên trang chủ)</span>
              </div>
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition ${
                errors.imageUrl ? 'border-red-400 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="https://example.com/anh-bai-viet.jpg"
            />
            {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl}</p>}
            {formData.imageUrl && !errors.imageUrl && (
              <div className="mt-2 rounded-xl overflow-hidden border border-gray-100">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-36 object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          {/* Link bài báo gốc */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
              <div className="flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-pink-500" />
                Link bài báo gốc
                <span className="text-gray-400 font-normal ml-1">(nhấn "Đọc thêm" sẽ mở link này)</span>
              </div>
            </label>
            <input
              type="url"
              value={formData.externalUrl}
              onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition ${
                errors.externalUrl ? 'border-red-400 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="https://vnexpress.net/bai-viet-ve-lam-dep..."
            />
            {errors.externalUrl && <p className="text-red-500 text-xs mt-1">{errors.externalUrl}</p>}
            {formData.externalUrl && !errors.externalUrl && (
              <a
                href={formData.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline mt-1"
              >
                <Eye className="w-3 h-3" /> Xem thử link
              </a>
            )}
          </div>

          {/* Trạng thái xuất bản */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, active: !formData.active })}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                formData.active ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  formData.active ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <div>
              <p className="text-sm font-medium text-zinc-700 flex items-center gap-1.5">
                {formData.active ? (
                  <><Eye className="w-4 h-4 text-green-500" /> Đã xuất bản</>
                ) : (
                  <><EyeOff className="w-4 h-4 text-gray-400" /> Lưu nháp</>
                )}
              </p>
              <p className="text-xs text-gray-400">
                {formData.active
                  ? 'Bài viết sẽ hiển thị trên trang chủ'
                  : 'Bài viết ẩn, chỉ admin xem được'}
              </p>
            </div>
          </div>

          {/* Error tổng */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}
        </form>

        {/* Footer actions */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-zinc-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="article-form"
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-purple-200"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isLoading ? 'Đang lưu...' : isEditing ? 'Lưu thay đổi' : 'Thêm bài viết'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;