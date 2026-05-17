import React from 'react';
import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BannerCarousel from '../components/BannerCarousel';
import VoucherSection from '../components/VoucherSection';
import FeaturedCategories from '../components/FeaturedCategories';
import FeaturedProducts from '../components/FeaturedProducts';
import FeaturedArticles from '../components/FeaturedArticles';
import FlashSale from '../components/FlashSale';
import { Link } from 'react-router-dom';
import { useUIConfig } from '../stores/uiConfigStore';
import type { SectionKey } from '../stores/uiConfigStore';

// ── Why Choose Us ──────────────────────────────────────────────────────────────
const COLOR_MAP: Record<string, string> = {
  purple: 'bg-purple-100',
  cyan: 'bg-cyan-100',
  pink: 'bg-pink-100',
  blue: 'bg-blue-100',
  green: 'bg-green-100',
  yellow: 'bg-yellow-100',
  orange: 'bg-orange-100',
  red: 'bg-red-100',
};

const WhyChooseSection: React.FC = () => {
  const { config } = useUIConfig();
  const { title, subtitle, items } = config.whyChooseUs;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-zinc-800 mb-4">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item.id} className="text-center p-6">
              <div className={`w-16 h-16 ${COLOR_MAP[item.color] ?? 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className="text-2xl">{item.emoji}</span>
              </div>
              <h3 className="text-xl font-semibold text-zinc-800 mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── CTA Section ────────────────────────────────────────────────────────────────
const CTASection: React.FC = () => (
  <section className="py-16 bg-gradient-to-r from-rose-500 to-fuchsia-600 text-white">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl font-bold mb-4">Sẵn sàng nâng cấp routine làm đẹp của bạn?</h2>
      <p className="text-xl mb-8 opacity-90">
        Liên hệ ngay để được tư vấn sản phẩm phù hợp với làn da và phong cách của bạn.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/contact"
          className="bg-white text-rose-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Tư vấn miễn phí
        </Link>
        <Link
          to="tel:0123456789"
          className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-rose-600 transition-colors"
        >
          Gọi Ngay: 0123 456 789
        </Link>
      </div>
    </div>
  </section>
);

// ── Section renderer ───────────────────────────────────────────────────────────
function renderSection(key: SectionKey): React.ReactNode {
  switch (key) {
    case 'banner':
      return (
        <section key="banner" className="max-w-7xl mx-auto px-4 py-8">
          <BannerCarousel />
        </section>
      );
    case 'voucher':
      return <VoucherSection key="voucher" />;
    case 'flashsale':
      return <FlashSale key="flashsale" />;
    case 'categories':
      return <FeaturedCategories key="categories" />;
    case 'featured':
      return <FeaturedProducts key="featured" />;
    case 'whychoose':
      return <WhyChooseSection key="whychoose" />;
    case 'articles':
      return <FeaturedArticles key="articles" />;
    case 'cta':
      return <CTASection key="cta" />;
    default:
      return null;
  }
}

// ── Home Page ──────────────────────────────────────────────────────────────────
const Home: React.FC = () => {
  const { config } = useUIConfig();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen beauty-shell">
      <Header />
      <main className="space-y-0">
        {config.homeSectionOrder.map((key) => renderSection(key))}
      </main>
      <Footer />
    </div>
  );
};

export default Home;