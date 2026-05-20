import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BannerItem {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  badge?: string;
  discount?: string;
  link?: string;
}

export interface WhyChooseItem {
  id: string;
  emoji: string;
  title: string;
  description: string;
  color: string; // e.g. 'purple', 'cyan', 'pink'
}

export type SectionKey =
  | 'banner'
  | 'voucher'
  | 'flashsale'
  | 'categories'
  | 'featured'
  | 'whychoose'
  | 'articles'
  | 'cta';

export interface UIConfig {
  banners: BannerItem[];
  featuredProducts: {
    count: number;
    columnsPerRow: number;
  };
  voucher: {
    visibleCount: number;
  };
  flashSale: {
    durationHours: number;
    visibleCount: number;
    columnsPerRow: number;
  };
  whyChooseUs: {
    title: string;
    subtitle: string;
    items: WhyChooseItem[];
  };
  homeSectionOrder: SectionKey[];
  productsPage: {
    pageSize: number;
    columnsPerRow: number;
  };
  contactPage: {
    address: string;
    phone: string;
    email: string;
    workingHours: string;
    mapUrl: string;
    facebook: string;
    instagram: string;
    youtube: string;
  };
}

// ─── Default Config ───────────────────────────────────────────────────────────

export const DEFAULT_CONFIG: UIConfig = {
  banners: [
    {
      id: 1,
      title: 'Mỹ phẩm Premium',
      subtitle: 'Bộ sưu tập mới nhất từ các thương hiệu hàng đầu',
      image: 'https://images.unsplash.com/photo-1596462502278-af242a95b598?w=1200&h=400&fit=crop',
      cta: 'Mua Ngay',
      badge: 'FLASH SALE',
      discount: '-50%',
    },
    {
      id: 2,
      title: 'Chăm Sóc Da Hoàn Hảo',
      subtitle: 'Sản phẩm skincare giúp da mịn màng, sáng bóng',
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&h=400&fit=crop',
      cta: 'Khám Phá',
      badge: 'DEAL HOT',
      discount: 'Giảm 25K',
    },
    {
      id: 3,
      title: 'Nước Hoa & Mùi Hương',
      subtitle: 'Hương thơm lâu lưu, sang trọng cho bạn',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&h=400&fit=crop',
      cta: 'Xem Chi Tiết',
      badge: 'MỚI POSTED',
    },
    {
      id: 4,
      title: 'Trang Điểm Chuyên Nghiệp',
      subtitle: 'Sản phẩm trang điểm cho mọi dịp',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&h=400&fit=crop',
      cta: 'Mua Ngay',
      discount: 'Freeship',
    },
  ],
  featuredProducts: {
    count: 4,
    columnsPerRow: 4,
  },
  voucher: {
    visibleCount: 4,
  },
  flashSale: {
    durationHours: 8,
    visibleCount: 5,
    columnsPerRow: 5,
  },
  whyChooseUs: {
    title: 'Tại sao chọn Lumière Beauty?',
    subtitle: 'Chúng tôi cam kết mang đến trải nghiệm mua sắm mỹ phẩm tinh tế, an toàn và đáng tin cậy.',
    items: [
      {
        id: 'quality',
        emoji: '🛡️',
        title: 'Chất lượng đảm bảo',
        description: 'Tất cả sản phẩm đều được tuyển chọn kỹ lưỡng, phù hợp cho nhiều loại da và nhu cầu làm đẹp.',
        color: 'purple',
      },
      {
        id: 'shipping',
        emoji: '🚀',
        title: 'Giao hàng nhanh',
        description: 'Giao hàng toàn quốc trong 24-48h, đóng gói cẩn thận và hỗ trợ đổi trả nhanh chóng.',
        color: 'cyan',
      },
      {
        id: 'support',
        emoji: '💬',
        title: 'Tư vấn 24/7',
        description: 'Đội ngũ tư vấn làm đẹp sẵn sàng hỗ trợ bạn mọi lúc mọi nơi.',
        color: 'pink',
      },
    ],
  },
  homeSectionOrder: ['banner', 'voucher', 'flashsale', 'categories', 'featured', 'whychoose', 'articles', 'cta'],
  productsPage: {
    pageSize: 12,
    columnsPerRow: 3,
  },
  contactPage: {
    address: 'số 4 Nguyễn Văn Bảo, Quận Gò Vấp, TP.HCM',
    phone: '0123 456 789',
    email: 'hello@lumierebeauty.vn',
    workingHours: 'T2 - T7: 8:00 - 18:00',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.857610747833!2d106.69723331526601!3d10.82220546130835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528e54e1837c7%3A0x203d789126e85848!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2hp4buHcCBULSBDaGkgTmjDoW5oIFRwLkjDtSBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1678888888888!5m2!1svi!2s',
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
  },
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface UIConfigContextValue {
  config: UIConfig;
  updateConfig: (partial: Partial<UIConfig>) => void;
  resetConfig: () => void;
}

const STORAGE_KEY = 'lumiere_ui_config';

const UIConfigContext = createContext<UIConfigContextValue | null>(null);

function loadFromStorage(): UIConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw) as Partial<UIConfig>;
    // Deep merge with defaults to handle new fields added later
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      featuredProducts: { ...DEFAULT_CONFIG.featuredProducts, ...parsed.featuredProducts },
      voucher: { ...DEFAULT_CONFIG.voucher, ...parsed.voucher },
      flashSale: { ...DEFAULT_CONFIG.flashSale, ...parsed.flashSale },
      whyChooseUs: {
        ...DEFAULT_CONFIG.whyChooseUs,
        ...parsed.whyChooseUs,
        items: parsed.whyChooseUs?.items ?? DEFAULT_CONFIG.whyChooseUs.items,
      },
      homeSectionOrder: parsed.homeSectionOrder ?? DEFAULT_CONFIG.homeSectionOrder,
      productsPage: { ...DEFAULT_CONFIG.productsPage, ...parsed.productsPage },
      contactPage: { ...DEFAULT_CONFIG.contactPage, ...parsed.contactPage },
      banners: parsed.banners ?? DEFAULT_CONFIG.banners,
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export const UIConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<UIConfig>(() => loadFromStorage());

  // Persist to localStorage whenever config changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // quota exceeded – ignore
    }
  }, [config]);

  const updateConfig = useCallback((partial: Partial<UIConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <UIConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </UIConfigContext.Provider>
  );
};

export function useUIConfig(): UIConfigContextValue {
  const ctx = useContext(UIConfigContext);
  if (!ctx) throw new Error('useUIConfig must be used inside UIConfigProvider');
  return ctx;
}
