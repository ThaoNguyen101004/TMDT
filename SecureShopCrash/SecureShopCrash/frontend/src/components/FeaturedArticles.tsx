import React, { useState, useEffect } from 'react';
import { ArticleApi } from '../utils/api';
import type { Article } from '../types/types';
import { BookOpen, Calendar, User, ArrowRight } from 'lucide-react';

const FeaturedArticles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await ArticleApi.getAll({ page: 0, size: 6, active: true });
        const list: Article[] = res.content || res;
        setArticles(list.filter((a: Article) => a.active).slice(0, 6));
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const getExcerpt = (article: Article, maxLen = 110) => {
    // Ưu tiên dùng summary nếu có
    const text = article.summary || (article.content ?? '').replace(/<[^>]+>/g, '').trim();
    return text.length > maxLen ? text.slice(0, maxLen) + '…' : text;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Link đọc thêm: nếu có externalUrl thì mở tab mới, không thì không hiện
  const ReadMoreBtn = ({ article, size = 'sm' }: { article: Article; size?: 'sm' | 'xs' }) => {
    if (!article.externalUrl) return null;
    return (
      <a
        href={article.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-1 font-semibold text-pink-500 hover:text-pink-700 transition-colors ${
          size === 'xs' ? 'text-xs' : 'text-xs'
        }`}
      >
        Đọc thêm <ArrowRight className={size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      </a>
    );
  };

  if (loading) {
    return (
      <section className="py-16 bg-rose-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-64 bg-pink-100 animate-pulse rounded mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="h-48 bg-pink-50 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-pink-50 animate-pulse rounded w-3/4" />
                  <div className="h-3 bg-pink-50 animate-pulse rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (articles.length === 0) return null;

  const [featured, ...rest] = articles;

  return (
    <section className="py-16 bg-rose-50/40 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header — không có "Xem tất cả" */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-pink-500 uppercase tracking-widest mb-2">
            Góc làm đẹp
          </p>
          <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-wider">
            Bài viết &amp; Blog
          </h2>
          <p className="mt-2 text-gray-500 text-sm max-w-md">
            Khám phá bí quyết làm đẹp, xu hướng mỹ phẩm mới nhất và lời khuyên chăm sóc da từ các chuyên gia.
          </p>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Card lớn – bài đầu tiên */}
          <div className="lg:col-span-1 group">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-pink-200 via-rose-100 to-fuchsia-200 flex-shrink-0">
                {featured.imageUrl ? (
                  <img
                    src={featured.imageUrl}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-pink-300" />
                  </div>
                )}
                <span className="absolute top-3 left-3 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Nổi bật
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-500 transition-colors">
                  {featured.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-3 flex-1 mb-4">
                  {getExcerpt(featured, 160)}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {featured.adminName || 'Admin'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(featured.publishedAt)}
                    </span>
                  </div>
                  <ReadMoreBtn article={featured} />
                </div>
              </div>
            </div>
          </div>

          {/* Các bài còn lại */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {rest.map((article) => (
              <div key={article.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <div className="relative h-40 overflow-hidden bg-gradient-to-br from-pink-100 via-fuchsia-50 to-rose-100 flex-shrink-0">
                  {article.imageUrl ? (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-pink-200" />
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-sm font-bold text-gray-900 mb-1.5 line-clamp-2 group-hover:text-pink-500 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 flex-1 mb-3">
                    {getExcerpt(article)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {formatDate(article.publishedAt)}
                    </span>
                    <ReadMoreBtn article={article} size="xs" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticles;
