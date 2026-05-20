import React, { useState } from 'react';
import { BookOpen, X, Maximize2, Minimize2, ChevronDown, ChevronRight, Package, ShoppingCart, Users, Tag, HeadphonesIcon } from 'lucide-react';

const AdminManual: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeSection, setActiveSection] = useState<string | null>('products');

    const sections = [
        {
            id: 'products',
            icon: <Package size={18} />,
            title: 'Quản lý Sản phẩm',
            content: (
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Thêm sản phẩm mới:</strong> Vào mục Sản phẩm, nhấn "Thêm mới", điền đầy đủ thông tin Tên, Giá, Số lượng, Danh mục và Tải ảnh lên.</li>
                    <li><strong>Cập nhật tồn kho:</strong> Chuyển sang thẻ Kho Hàng để kiểm tra số lượng tồn và bổ sung nhanh.</li>
                    <li><strong>Ngừng kinh doanh:</strong> Sửa sản phẩm và chuyển trạng thái thành Ẩn/Ngừng bán thay vì xóa để giữ lại lịch sử đơn hàng.</li>
                </ul>
            )
        },
        {
            id: 'orders',
            icon: <ShoppingCart size={18} />,
            title: 'Xử lý Đơn hàng',
            content: (
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Xác nhận đơn:</strong> Kiểm tra các đơn "Chờ xác nhận" và chuyển sang "Đang xử lý".</li>
                    <li><strong>Giao hàng:</strong> Cập nhật trạng thái "Đang giao" khi đã giao cho đơn vị vận chuyển.</li>
                    <li><strong>Hoàn tất/Hủy:</strong> Xác nhận thành công hoặc Hủy đơn nếu khách yêu cầu hoặc không nhận hàng.</li>
                </ul>
            )
        },
        {
            id: 'customers',
            icon: <Users size={18} />,
            title: 'Quản lý Khách hàng',
            content: (
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Phân quyền:</strong> Bạn có thể cấp quyền Admin cho một người dùng bằng cách sửa trạng thái vai trò.</li>
                    <li><strong>Khóa tài khoản:</strong> Nếu phát hiện gian lận, hãy khóa (Deactivate) tài khoản người dùng đó.</li>
                </ul>
            )
        },
        {
            id: 'support',
            icon: <HeadphonesIcon size={18} />,
            title: 'Quản lý Hỗ trợ (Tickets)',
            content: (
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Ticket hỗ trợ:</strong> Tiếp nhận thắc mắc và trả lời khách hàng. Cập nhật trạng thái thành Đang xử lý hoặc Đã giải quyết.</li>
                    <li><strong>Yêu cầu bảo hành:</strong> Xem xét ảnh/video đính kèm của khách hàng để quyết định Chấp nhận/Từ chối bảo hành.</li>
                    <li>Bạn có thể trực tiếp Thêm mới/Sửa/Xóa Ticket ở màn hình Quản lý Hỗ trợ nếu cần thiết.</li>
                </ul>
            )
        },
        {
            id: 'promotions',
            icon: <Tag size={18} />,
            title: 'Chương trình Khuyến mãi',
            content: (
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Tạo Mã giảm giá (Coupon):</strong> Cài đặt phần trăm giảm, số lượng và thời hạn sử dụng.</li>
                    <li><strong>Flash Sale:</strong> Cấu hình danh sách sản phẩm hiển thị trên trang chủ trong thời gian giới hạn.</li>
                </ul>
            )
        }
    ];

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-pink-600 text-white p-4 rounded-full shadow-xl hover:bg-pink-700 transition-all hover:scale-110 z-50 flex items-center justify-center group"
                title="Sổ tay Admin"
            >
                <BookOpen size={28} />
                <span className="absolute right-full mr-4 bg-gray-900 text-white text-sm px-3 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Sổ tay Admin
                </span>
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 bg-white shadow-2xl rounded-2xl overflow-hidden z-50 flex flex-col transition-all duration-300 border border-pink-100 ${isExpanded ? 'w-[800px] h-[80vh]' : 'w-[400px] h-[550px]'}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-600 to-pink-500 text-white p-4 flex justify-between items-center shrink-0 shadow-sm">
                <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Sổ tay Admin</h3>
                        <p className="text-xs text-pink-100 opacity-90">Hướng dẫn sử dụng hệ thống</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)} 
                        className="text-white hover:text-pink-200 transition p-1 hover:bg-white/10 rounded"
                    >
                        {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                    </button>
                    <button 
                        onClick={() => setIsOpen(false)} 
                        className="text-white hover:text-pink-200 transition p-1 hover:bg-white/10 rounded"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
                <p className="text-sm text-gray-600 mb-4 pb-4 border-b">
                    Chào mừng bạn đến với hệ thống quản trị! Dưới đây là các hướng dẫn cơ bản giúp bạn quản lý cửa hàng hiệu quả.
                </p>

                <div className="space-y-3">
                    {sections.map((section) => (
                        <div key={section.id} className="bg-white border rounded-xl overflow-hidden shadow-sm">
                            <button
                                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center space-x-3 text-gray-800 font-semibold">
                                    <div className="text-pink-500">
                                        {section.icon}
                                    </div>
                                    <span>{section.title}</span>
                                </div>
                                {activeSection === section.id ? (
                                    <ChevronDown size={18} className="text-gray-400" />
                                ) : (
                                    <ChevronRight size={18} className="text-gray-400" />
                                )}
                            </button>
                            
                            {activeSection === section.id && (
                                <div className="px-4 pb-4 pt-2 bg-pink-50/30 border-t">
                                    {section.content}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                
                <div className="mt-8 p-4 bg-blue-50 rounded-xl text-sm text-blue-800 flex flex-col gap-2">
                    <strong>💡 Mẹo nhỏ:</strong>
                    <span>Luôn kiểm tra thẻ "Thông báo" hoặc "Bảng điều khiển" mỗi ngày để không bỏ lỡ các đơn hàng và yêu cầu hỗ trợ mới nhất!</span>
                </div>
            </div>
        </div>
    );
};

export default AdminManual;
