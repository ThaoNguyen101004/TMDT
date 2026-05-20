import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Facebook, Instagram, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useUIConfig } from '../stores/uiConfigStore';

const Contact: React.FC = () => {

  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { config } = useUIConfig();
  const contactConfig = config.contactPage;

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Địa chỉ',
      content: contactConfig.address,
      link: contactConfig.mapUrl
    },
    {
      icon: Phone,
      title: 'Điện thoại',
      content: contactConfig.phone,
      link: `tel:${contactConfig.phone.replace(/[^0-9+]/g, '')}`
    },
    {
      icon: Mail,
      title: 'Email',
      content: contactConfig.email,
      link: `mailto:${contactConfig.email}`
    },
    {
      icon: Clock,
      title: 'Giờ làm việc',
      content: contactConfig.workingHours,
      link: null
    }
  ];

  const branches = [
    {
      city: 'TP. Hồ Chí Minh',
      address: 'Số 4 Nguyễn Văn Bảo, Quận Gò Vấp',
      phone: '0123 456 789',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      city: 'Hà Nội',
      address: '456 Đường Láng, Quận Đống Đa',
      phone: '0123 456 790',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      city: 'Đà Nẵng',
      address: '789 Đường Trần Phú, Quận Hải Châu',
      phone: '0123 456 791',
      image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ];

  const faqs = [
    {
      question: 'Sản phẩm có được bảo hành không?',
      answer: 'Tất cả sản phẩm của chúng tôi đều được bảo hành chính hãng từ 12-24 tháng tùy theo loại sản phẩm.'
    },
    {
      question: 'Có hỗ trợ lắp đặt miễn phí không?',
      answer: 'Chúng tôi hỗ trợ lắp đặt miễn phí cho đơn hàng trên 5 triệu đồng trong nội thành.'
    },
    {
      question: 'Thời gian giao hàng là bao lâu?',
      answer: 'Đơn hàng trong nội thành sẽ được giao trong 24h, ngoại thành và tỉnh từ 2-3 ngày.'
    },
    {
      question: 'Có chính sách đổi trả không?',
      answer: 'Chúng tôi hỗ trợ đổi trả trong vòng 7 ngày nếu sản phẩm có lỗi từ nhà sản xuất.'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-rose-50">
        <Header />
      {/* Hero Section */}
      <section className="relative h-[300px] bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Liên Hệ Với Chúng Tôi</h1>
            <p className="text-xl md:text-2xl opacity-90">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
                >
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-pink-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-800 mb-2">{info.title}</h3>
                  {info.link ? (
                    <a 
                      href={info.link}
                      className="text-gray-600 hover:text-pink-500 transition-colors"
                    >
                      {info.content}
                    </a>
                  ) : (
                    <p className="text-gray-600">{info.content}</p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-zinc-800 mb-6">Gửi Tin Nhắn Cho Chúng Tôi</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-pink-50/30"
                    placeholder="Nhập họ và tên của bạn"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-pink-50/30"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-pink-50/30"
                      placeholder="0123 456 789"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Chủ đề
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-pink-50/30"
                  >
                    <option value="">Chọn chủ đề</option>
                    <option value="product">Tư vấn sản phẩm</option>
                    <option value="support">Hỗ trợ kỹ thuật</option>
                    <option value="warranty">Bảo hành</option>
                    <option value="partnership">Hợp tác kinh doanh</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent resize-none bg-pink-50/30"
                    placeholder="Nhập nội dung tin nhắn của bạn..."
                  ></textarea>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-400 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-pink-200"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Gửi Tin Nhắn</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Map & Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-gray-100 rounded-lg overflow-hidden h-80 md:h-[400px]">
                <iframe 
                  src={contactConfig.mapUrl} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full border-0"
                ></iframe>
              </div>

              <div className="bg-gradient-to-br from-pink-400 via-rose-400 to-fuchsia-400 p-6 rounded-lg text-white">
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle className="h-6 w-6" />
                  <h3 className="text-xl font-semibold">Kết Nối Với Chúng Tôi</h3>
                </div>
                <p className="mb-6 opacity-90">
                  Theo dõi chúng tôi trên các kênh mạng xã hội để cập nhật tin tức và ưu đãi mới nhất
                </p>
                <div className="flex gap-4">
                  <a
                    href={contactConfig.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Facebook className="h-6 w-6" />
                  </a>
                  <a
                    href={contactConfig.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                  <a
                    href={contactConfig.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Youtube className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Cần Hỗ Trợ Ngay?</h2>
            <p className="text-xl mb-8 opacity-90">
              Gọi điện cho chúng tôi để được tư vấn miễn phí ngay bây giờ
            </p>
            <a
              href={`tel:${contactConfig.phone.replace(/[^0-9+]/g, '')}`}
              className="inline-flex items-center gap-2 bg-white text-pink-500 px-8 py-3 rounded-lg font-semibold hover:bg-rose-50 transition-colors"
            >
              <Phone className="h-5 w-5" />
              {contactConfig.phone}
            </a>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;