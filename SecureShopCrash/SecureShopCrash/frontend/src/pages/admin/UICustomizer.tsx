import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2, RotateCcw, Save, Image, ChevronDown, ChevronUp } from 'lucide-react';
import { useUIConfig, DEFAULT_CONFIG, type BannerItem, type SectionKey, type WhyChooseItem } from '../../stores/uiConfigStore';
import { toast } from 'react-toastify';

// ── Section labels ────────────────────────────────────────────────────────────
const SECTION_LABELS: Record<SectionKey, string> = {
  banner: '🖼️ Banner',
  voucher: '🎟️ Mã giảm giá',
  flashsale: '⚡ Flash Sale',
  categories: '🗂️ Danh mục nổi bật',
  featured: '⭐ Sản phẩm nổi bật',
  whychoose: '💡 Tại sao chọn chúng tôi',
  articles: '📰 Bài viết',
  cta: '📣 CTA Banner',
};

const EMOJI_OPTIONS = ['🛡️','🚀','💬','🎁','⭐','🔥','💎','🌸','✨','🧴','💄','👑','🏆','💪','❤️','🌟'];
const COLOR_OPTIONS = ['purple','cyan','pink','blue','green','yellow','orange','red'];

// ── Sortable Section Item ─────────────────────────────────────────────────────
function SortableSection({ id, label }: { id: string; label: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
    >
      <button {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600">
        <GripVertical className="w-5 h-5" />
      </button>
      <span className="font-medium text-gray-700">{label}</span>
    </div>
  );
}

// ── Sub-panel tabs ────────────────────────────────────────────────────────────
type Panel = 'banner' | 'featured' | 'voucher' | 'flashsale' | 'whychoose' | 'order' | 'products' | 'contact';

const PANELS: { key: Panel; label: string }[] = [
  { key: 'order', label: '📐 Thứ tự Section' },
  { key: 'banner', label: '🖼️ Banner' },
  { key: 'featured', label: '⭐ SP Nổi bật' },
  { key: 'voucher', label: '🎟️ Mã giảm giá' },
  { key: 'flashsale', label: '⚡ Flash Sale' },
  { key: 'whychoose', label: '💡 Tại sao chọn' },
  { key: 'products', label: '🛍️ Trang SP' },
  { key: 'contact', label: '📞 Liên hệ' },
];

// ── Main Component ────────────────────────────────────────────────────────────
const UICustomizer: React.FC = () => {
  const { config, updateConfig, resetConfig } = useUIConfig();
  const [activePanel, setActivePanel] = useState<Panel>('order');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleSave = () => {
    toast.success('Đã lưu cấu hình giao diện!', { position: 'bottom-right' });
  };

  const handleReset = () => {
    if (window.confirm('Bạn có chắc muốn khôi phục cài đặt mặc định?')) {
      resetConfig();
      toast.info('🔄 Đã khôi phục cài đặt mặc định', { position: 'bottom-right' });
    }
  };

  // ── Section order DnD ────────────────────────────────────────────────────────
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = config.homeSectionOrder.indexOf(active.id as SectionKey);
    const newIndex = config.homeSectionOrder.indexOf(over.id as SectionKey);
    updateConfig({ homeSectionOrder: arrayMove([...config.homeSectionOrder], oldIndex, newIndex) });
  };

  // ── Banner helpers ──────────────────────────────────────────────────────────
  const updateBanner = (idx: number, field: keyof BannerItem, value: string) => {
    const banners = config.banners.map((b, i) => i === idx ? { ...b, [field]: value } : b);
    updateConfig({ banners });
  };
  const addBanner = () => {
    updateConfig({
      banners: [...config.banners, { id: Date.now(), title: 'Banner mới', subtitle: 'Mô tả banner', image: '', cta: 'Xem ngay' }],
    });
  };
  const removeBanner = (idx: number) => {
    updateConfig({ banners: config.banners.filter((_, i) => i !== idx) });
  };

  // ── Why Choose helpers ──────────────────────────────────────────────────────
  const updateWhyItem = (idx: number, field: keyof WhyChooseItem, value: string) => {
    const items = config.whyChooseUs.items.map((it, i) => i === idx ? { ...it, [field]: value } : it);
    updateConfig({ whyChooseUs: { ...config.whyChooseUs, items } });
  };

  // ── Render panels ───────────────────────────────────────────────────────────
  const renderPanel = () => {
    switch (activePanel) {
      // ── Order ──────────────────────────────────────────────────────────────
      case 'order':
        return (
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Kéo thả để thay đổi thứ tự các thành phần trang chủ</h3>
            <p className="text-sm text-gray-500 mb-4">Thay đổi sẽ áp dụng ngay trên trang chủ.</p>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={config.homeSectionOrder} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {config.homeSectionOrder.map((key) => (
                    <SortableSection key={key} id={key} label={SECTION_LABELS[key]} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        );

      // ── Banner ─────────────────────────────────────────────────────────────
      case 'banner':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Danh sách banner ({config.banners.length})</h3>
              <button onClick={addBanner} className="flex items-center gap-1 bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-purple-700 transition-colors">
                <Plus className="w-4 h-4" /> Thêm banner
              </button>
            </div>
            {config.banners.map((banner, idx) => (
              <BannerCard key={banner.id} banner={banner} idx={idx} onUpdate={updateBanner} onRemove={removeBanner} />
            ))}
          </div>
        );

      // ── Featured Products ───────────────────────────────────────────────────
      case 'featured':
        return (
          <div className="space-y-6">
            <h3 className="font-semibold text-gray-800">Sản phẩm nổi bật</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số sản phẩm hiển thị: <span className="text-purple-600 font-bold">{config.featuredProducts.count}</span></label>
              <input type="range" min={2} max={12} value={config.featuredProducts.count}
                onChange={e => updateConfig({ featuredProducts: { ...config.featuredProducts, count: +e.target.value } })}
                className="w-full accent-purple-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>2</span><span>12</span></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số sản phẩm mỗi dòng:</label>
              <div className="flex gap-2">
                {[2, 3, 4].map(n => (
                  <button key={n} onClick={() => updateConfig({ featuredProducts: { ...config.featuredProducts, columnsPerRow: n } })}
                    className={`flex-1 py-2 rounded-lg border-2 font-semibold transition-colors ${config.featuredProducts.columnsPerRow === n ? 'border-purple-600 bg-purple-50 text-purple-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    {n} cột
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      // ── Voucher ─────────────────────────────────────────────────────────────
      case 'voucher':
        return (
          <div className="space-y-6">
            <h3 className="font-semibold text-gray-800">Mã giảm giá</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số mã hiển thị mỗi trang:</label>
              <div className="flex gap-2">
                {[2, 3, 4].map(n => (
                  <button key={n} onClick={() => updateConfig({ voucher: { visibleCount: n } })}
                    className={`flex-1 py-2 rounded-lg border-2 font-semibold transition-colors ${config.voucher.visibleCount === n ? 'border-purple-600 bg-purple-50 text-purple-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    {n} mã
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      // ── Flash Sale ──────────────────────────────────────────────────────────
      case 'flashsale':
        return (
          <div className="space-y-6">
            <h3 className="font-semibold text-gray-800">Flash Sale</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian đếm ngược: <span className="text-red-500 font-bold">{config.flashSale.durationHours} giờ</span></label>
              <input type="range" min={1} max={24} value={config.flashSale.durationHours}
                onChange={e => updateConfig({ flashSale: { ...config.flashSale, durationHours: +e.target.value } })}
                className="w-full accent-red-500" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1 giờ</span><span>24 giờ</span></div>
              <p className="text-xs text-amber-600 mt-2 bg-amber-50 p-2 rounded-lg">⚠️ Thay đổi này sẽ reset đồng hồ đếm ngược.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số sản phẩm hiển thị: <span className="text-red-500 font-bold">{config.flashSale.visibleCount}</span></label>
              <input type="range" min={3} max={8} value={config.flashSale.visibleCount}
                onChange={e => updateConfig({ flashSale: { ...config.flashSale, visibleCount: +e.target.value } })}
                className="w-full accent-red-500" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>3</span><span>8</span></div>
            </div>
          </div>
        );

      // ── Why Choose ──────────────────────────────────────────────────────────
      case 'whychoose':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Phần "Tại sao chọn chúng tôi"</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề lớn</label>
              <input type="text" value={config.whyChooseUs.title}
                onChange={e => updateConfig({ whyChooseUs: { ...config.whyChooseUs, title: e.target.value } })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả phụ</label>
              <textarea value={config.whyChooseUs.subtitle}
                onChange={e => updateConfig({ whyChooseUs: { ...config.whyChooseUs, subtitle: e.target.value } })}
                rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none" />
            </div>
            <div className="space-y-4 mt-2">
              {config.whyChooseUs.items.map((item, idx) => (
                <div key={item.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3">
                  <p className="font-medium text-gray-700 text-sm">Mục {idx + 1}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Icon Emoji</label>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {EMOJI_OPTIONS.map(em => (
                          <button key={em} onClick={() => updateWhyItem(idx, 'emoji', em)}
                            className={`text-lg p-1 rounded transition-colors ${item.emoji === em ? 'bg-purple-100 ring-2 ring-purple-400' : 'hover:bg-gray-200'}`}>{em}</button>
                        ))}
                      </div>
                      <input type="text" value={item.emoji} onChange={e => updateWhyItem(idx, 'emoji', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm" placeholder="Hoặc nhập emoji" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Màu nền icon</label>
                      <div className="flex flex-wrap gap-1">
                        {COLOR_OPTIONS.map(c => (
                          <button key={c} onClick={() => updateWhyItem(idx, 'color', c)}
                            className={`w-6 h-6 rounded-full bg-${c}-200 border-2 ${item.color === c ? 'border-gray-700 scale-110' : 'border-transparent'} transition-transform`} title={c} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Tiêu đề</label>
                    <input type="text" value={item.title} onChange={e => updateWhyItem(idx, 'title', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Mô tả</label>
                    <textarea value={item.description} onChange={e => updateWhyItem(idx, 'description', e.target.value)}
                      rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // ── Products Page ───────────────────────────────────────────────────────
      case 'products':
        return (
          <div className="space-y-6">
            <h3 className="font-semibold text-gray-800">Trang Sản Phẩm</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số sản phẩm mỗi trang:</label>
              <div className="grid grid-cols-4 gap-2">
                {[6, 12, 24, 48].map(n => (
                  <button key={n} onClick={() => updateConfig({ productsPage: { ...config.productsPage, pageSize: n } })}
                    className={`py-2 rounded-lg border-2 font-semibold transition-colors ${config.productsPage.pageSize === n ? 'border-purple-600 bg-purple-50 text-purple-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số sản phẩm mỗi dòng (chế độ lưới):</label>
              <div className="flex gap-2">
                {[2, 3, 4].map(n => (
                  <button key={n} onClick={() => updateConfig({ productsPage: { ...config.productsPage, columnsPerRow: n } })}
                    className={`flex-1 py-2 rounded-lg border-2 font-semibold transition-colors ${config.productsPage.columnsPerRow === n ? 'border-purple-600 bg-purple-50 text-purple-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    {n} cột
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      // ── Contact Page ────────────────────────────────────────────────────────
      case 'contact':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Thông tin Trang Liên Hệ</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                <input type="text" value={config.contactPage.address}
                  onChange={e => updateConfig({ contactPage: { ...config.contactPage, address: e.target.value } })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Điện thoại</label>
                <input type="text" value={config.contactPage.phone}
                  onChange={e => updateConfig({ contactPage: { ...config.contactPage, phone: e.target.value } })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={config.contactPage.email}
                  onChange={e => updateConfig({ contactPage: { ...config.contactPage, email: e.target.value } })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giờ làm việc</label>
                <input type="text" value={config.contactPage.workingHours}
                  onChange={e => updateConfig({ contactPage: { ...config.contactPage, workingHours: e.target.value } })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link Google Map (URL nhúng - src)</label>
              <textarea value={config.contactPage.mapUrl}
                onChange={e => updateConfig({ contactPage: { ...config.contactPage, mapUrl: e.target.value } })}
                rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none" />
              <p className="text-xs text-gray-500 mt-1">Lấy link src="..." từ mã nhúng iframe của Google Maps.</p>
            </div>
            <h4 className="font-semibold text-gray-800 mt-6 pt-4 border-t border-gray-100">Mạng Xã Hội</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                <input type="url" value={config.contactPage.facebook}
                  onChange={e => updateConfig({ contactPage: { ...config.contactPage, facebook: e.target.value } })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                <input type="url" value={config.contactPage.instagram}
                  onChange={e => updateConfig({ contactPage: { ...config.contactPage, instagram: e.target.value } })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Youtube</label>
                <input type="url" value={config.contactPage.youtube}
                  onChange={e => updateConfig({ contactPage: { ...config.contactPage, youtube: e.target.value } })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-800">Tùy chỉnh Giao diện</h2>
          <p className="text-gray-500 text-sm mt-1">Thay đổi được lưu tự động vào trình duyệt</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">
            <RotateCcw className="w-4 h-4" /> Mặc định
          </button>
          <button onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-fuchsia-600 text-white rounded-xl hover:opacity-90 transition-opacity text-sm font-medium shadow-md">
            <Save className="w-4 h-4" /> Lưu thay đổi
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left nav */}
        <aside className="w-48 flex-shrink-0">
          <nav className="space-y-1">
            {PANELS.map(p => (
              <button key={p.key} onClick={() => setActivePanel(p.key)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activePanel === p.key ? 'bg-gradient-to-r from-rose-500 to-fuchsia-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
                {p.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Panel content */}
        <div className="flex-1 bg-gray-50 rounded-xl p-6 border border-gray-200 min-h-[400px]">
          {renderPanel()}
        </div>
      </div>
    </div>
  );
};

// ── Banner Card subcomponent ──────────────────────────────────────────────────
function BannerCard({ banner, idx, onUpdate, onRemove }: {
  banner: BannerItem;
  idx: number;
  onUpdate: (idx: number, field: keyof BannerItem, value: string) => void;
  onRemove: (idx: number) => void;
}) {
  const [open, setOpen] = useState(idx === 0);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">
          {banner.image && (
            <img src={banner.image} alt="" className="w-12 h-8 object-cover rounded" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          )}
          {!banner.image && <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center"><Image className="w-4 h-4 text-gray-300" /></div>}
          <span className="font-medium text-sm text-gray-700">Banner {idx + 1}: {banner.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={e => { e.stopPropagation(); onRemove(idx); }}
            className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
          {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">URL Ảnh</label>
            <input type="url" value={banner.image} onChange={e => onUpdate(idx, 'image', e.target.value)}
              placeholder="https://..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            {banner.image && (
              <img src={banner.image} alt="preview" className="mt-2 w-full h-24 object-cover rounded-lg" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Tiêu đề</label>
              <input type="text" value={banner.title} onChange={e => onUpdate(idx, 'title', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Nút CTA</label>
              <input type="text" value={banner.cta} onChange={e => onUpdate(idx, 'cta', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Mô tả phụ</label>
            <input type="text" value={banner.subtitle} onChange={e => onUpdate(idx, 'subtitle', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Badge (tuỳ chọn)</label>
              <input type="text" value={banner.badge ?? ''} onChange={e => onUpdate(idx, 'badge', e.target.value)}
                placeholder="VD: FLASH SALE" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Nội dung giảm giá</label>
              <input type="text" value={banner.discount ?? ''} onChange={e => onUpdate(idx, 'discount', e.target.value)}
                placeholder="VD: -50%" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UICustomizer;
