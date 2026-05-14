-- ============================================================
-- COMPREHENSIVE SEED DATA - Lumière Beauty (Cosmetics Store)
-- Toàn bộ dữ liệu test cho tất cả chức năng
-- ============================================================

-- Clean up order: delete child tables first, then parent tables
DELETE FROM public.reviews;
DELETE FROM public.warranty_requests;
DELETE FROM public.support_tickets;
DELETE FROM public.shipments;
DELETE FROM public.payments;
DELETE FROM public.order_items;
DELETE FROM public.orders;
DELETE FROM public.addresses;
DELETE FROM public.articles;
DELETE FROM public.inventory;
DELETE FROM public.products;
DELETE FROM public.discounts;
DELETE FROM public.categories;
DELETE FROM public.brands;
DELETE FROM public.users;

-- ============================================================
-- 1. USERS (15 người dùng: 2 admin, 13 user thường)
-- Password: Password123! (bcrypt hash)
-- ============================================================
INSERT INTO public.users (id, created_at, updated_at, avatar_url, deleted_at, email, enabled, name, password_hash, phone, provider, role) 
VALUES
-- Existing admins - keep them
('a1b2c3d4-0001-0001-0001-000000000001', '2024-01-10 08:00:00+07', '2024-01-10 08:00:00+07', 'https://placehold.co/150x150/png?text=Admin1', NULL, 'admin@lumiere.vn', true, 'Nguyễn Quản Trị', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0901000001', 'LOCAL', 'ADMIN'),
('a1b2c3d4-0002-0002-0002-000000000002', '2024-01-15 09:00:00+07', '2024-01-15 09:00:00+07', 'https://placehold.co/150x150/png?text=Admin2', NULL, 'admin2@lumiere.vn', true, 'Trần Thị Hoa', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0901000002', 'LOCAL', 'ADMIN'),
-- Regular users
('b2c3d4e5-0003-0003-0003-000000000003', '2024-02-01 10:00:00+07', '2024-02-01 10:00:00+07', 'https://placehold.co/150x150/png?text=User3', NULL, 'minh.nguyen@gmail.com', true, 'Nguyễn Văn Minh', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0912345601', 'LOCAL', 'USER'),
('b2c3d4e5-0004-0004-0004-000000000004', '2024-02-10 11:00:00+07', '2024-02-10 11:00:00+07', 'https://placehold.co/150x150/png?text=User4', NULL, 'huong.tran@gmail.com', true, 'Trần Thị Hương', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0912345602', 'GOOGLE', 'USER'),
('b2c3d4e5-0005-0005-0005-000000000005', '2024-02-20 12:00:00+07', '2024-02-20 12:00:00+07', 'https://placehold.co/150x150/png?text=User5', NULL, 'duc.le@gmail.com', true, 'Lê Văn Đức', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0912345603', 'LOCAL', 'USER'),
('b2c3d4e5-0006-0006-0006-000000000006', '2024-03-01 08:30:00+07', '2024-03-01 08:30:00+07', 'https://placehold.co/150x150/png?text=User6', NULL, 'linh.pham@gmail.com', true, 'Phạm Thị Linh', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0912345604', 'GOOGLE', 'USER'),
('b2c3d4e5-0007-0007-0007-000000000007', '2024-03-15 14:00:00+07', '2024-03-15 14:00:00+07', NULL, NULL, 'tuan.vo@gmail.com', true, 'Võ Minh Tuấn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0912345605', 'LOCAL', 'USER'),
('b2c3d4e5-0008-0008-0008-000000000008', '2024-04-01 09:00:00+07', '2024-04-01 09:00:00+07', NULL, NULL, 'an.hoang@gmail.com', true, 'Hoàng Thị An', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0912345606', 'LOCAL', 'USER'),
('b2c3d4e5-0009-0009-0009-000000000009', '2024-04-10 10:30:00+07', '2024-04-10 10:30:00+07', NULL, NULL, 'hanh.tran@gmail.com', true, 'Trần Hạnh', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0912345607', 'LOCAL', 'USER'),
('b2c3d4e5-0010-0010-0010-000000000010', '2024-04-15 11:00:00+07', '2024-04-15 11:00:00+07', 'https://placehold.co/150x150/png?text=User10', NULL, 'nam.pham@gmail.com', true, 'Phạm Văn Nam', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0912345608', 'LOCAL', 'USER'),
('b2c3d4e5-0011-0011-0011-000000000011', '2024-04-20 09:00:00+07', '2024-04-20 09:00:00+07', NULL, NULL, 'chi.le@gmail.com', true, 'Lê Thị Chi', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0912345609', 'GOOGLE', 'USER'),
('b2c3d4e5-0012-0012-0012-000000000012', '2024-04-25 14:30:00+07', '2024-04-25 14:30:00+07', 'https://placehold.co/150x150/png?text=User12', NULL, 'vinh.duong@gmail.com', true, 'Dương Minh Vinh', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0912345610', 'LOCAL', 'USER'),
('b2c3d4e5-0013-0013-0013-000000000013', '2024-05-01 08:00:00+07', '2024-05-01 08:00:00+07', NULL, NULL, 'lan.hoang@gmail.com', true, 'Hoàng Thị Lan', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0912345611', 'LOCAL', 'USER'),
('b2c3d4e5-0014-0014-0014-000000000014', '2024-05-05 10:00:00+07', '2024-05-05 10:00:00+07', 'https://placehold.co/150x150/png?text=User14', NULL, 'khanh.nguyen@gmail.com', true, 'Nguyễn Hồng Khánh', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0912345612', 'LOCAL', 'USER'),
('b2c3d4e5-0015-0015-0015-000000000015', '2024-05-10 15:00:00+07', '2024-05-10 15:00:00+07', NULL, NULL, 'huy.nguyen@gmail.com', true, 'Nguyễn Văn Huy', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0912345613', 'GOOGLE', 'USER')
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- 2. ADDRESSES (18 địa chỉ giao hàng)
-- ============================================================

INSERT INTO public.addresses (user_id, name, phone, street, ward, province, is_default) VALUES
-- User 3
('b2c3d4e5-0003-0003-0003-000000000003', 'Nhà Minh', '0912345601', '123 Nguyễn Hữu Cảnh, Phường 22, Bình Thạnh', 'Phường 22', 'Thành phố Hồ Chí Minh', true),
('b2c3d4e5-0003-0003-0003-000000000003', 'Công ty Minh', '0912345601', '456 Lê Văn Sỹ, Phường 14, Quận 3', 'Phường 14', 'Thành phố Hồ Chí Minh', false),
-- User 4
('b2c3d4e5-0004-0004-0004-000000000004', 'Nhà Hương', '0912345602', '789 Cách Mạng Tháng 8, Phường Tân Lợi', 'Phường Tân Lợi', 'Thành phố Hà Nội', true),
('b2c3d4e5-0004-0004-0004-000000000004', 'Nhà ông bà', '0912345602', '321 Trần Hưng Đạo, Phường Hàng Trạm', 'Phường Hàng Trạm', 'Thành phố Hà Nội', false),
-- User 5
('b2c3d4e5-0005-0005-0005-000000000005', 'Nhà Đức', '0912345603', '654 Nguyễn Văn Linh, Hải Châu', 'Hải Châu', 'Thành phố Đà Nẵng', true),
-- User 6
('b2c3d4e5-0006-0006-0006-000000000006', 'Nhà Linh', '0912345604', '987 Lê Thánh Tôn, Phường Tây Hồ', 'Phường Tây Hồ', 'Thành phố Hà Nội', true),
('b2c3d4e5-0006-0006-0006-000000000006', 'Quán cà phê', '0912345604', '111 Nguyễn Du, Phường Bến Nghé', 'Phường Bến Nghé', 'Thành phố Hồ Chí Minh', false),
-- User 7
('b2c3d4e5-0007-0007-0007-000000000007', 'Nhà Tuấn', '0912345605', '222 Võ Thị Sáu, Quận Hải Châu', 'Quận Hải Châu', 'Thành phố Đà Nẵng', true),
-- User 8
('b2c3d4e5-0008-0008-0008-000000000008', 'Nhà An', '0912345606', '333 Trần Phú, Phường 9', 'Phường 9', 'Thành phố Hồ Chí Minh', true),
-- User 9
('b2c3d4e5-0009-0009-0009-000000000009', 'Nhà Hạnh', '0912345607', '444 Đinh Bộ Lĩnh, Phường Tân Thành', 'Phường Tân Thành', 'Thành phố Hồ Chí Minh', true),
('b2c3d4e5-0009-0009-0009-000000000009', 'Văn phòng', '0912345607', '555 Trần Hưng Đạo, Phường 1', 'Phường 1', 'Thành phố Hồ Chí Minh', false),
-- User 10
('b2c3d4e5-0010-0010-0010-000000000010', 'Nhà Nam', '0912345608', '666 Phan Bội Châu, Phường Tứ Xuyên', 'Phường Tứ Xuyên', 'Thành phố Huế', true),
-- User 11
('b2c3d4e5-0011-0011-0011-000000000011', 'Nhà Chi', '0912345609', '777 Hoàng Văn Thụ, Phường 2', 'Phường 2', 'Thành phố Hồ Chí Minh', true),
('b2c3d4e5-0011-0011-0011-000000000011', 'Nhà bạn', '0912345609', '888 Nguyễn Huệ, Phường Bến Nghé', 'Phường Bến Nghé', 'Thành phố Hồ Chí Minh', false),
-- User 12
('b2c3d4e5-0012-0012-0012-000000000012', 'Nhà Vinh', '0912345610', '999 Đồng Khởi, Phường Bến Nghé', 'Phường Bến Nghé', 'Thành phố Hồ Chí Minh', true),
-- User 13
('b2c3d4e5-0013-0013-0013-000000000013', 'Nhà Lan', '0912345611', '1010 Tôn Đức Thắng, Phường Bến Nghé', 'Phường Bến Nghé', 'Thành phố Hồ Chí Minh', true),
-- User 14
('b2c3d4e5-0014-0014-0014-000000000014', 'Nhà Khánh', '0912345612', '1111 Lê Quý Đôn, Phường 6', 'Phường 6', 'Thành phố Hồ Chí Minh', true),
-- User 15
('b2c3d4e5-0015-0015-0015-000000000015', 'Nhà Huy', '0912345613', '1212 Hàng Gà, Phường Hoàn Kiếm', 'Phường Hoàn Kiếm', 'Thành phố Hà Nội', true);

-- ============================================================
-- 3. DISCOUNTS / VOUCHERS (12 mã giảm giá)
-- ============================================================

INSERT INTO public.discounts (id, created_at, updated_at, active, code, discount_type, discount_value, start_at, end_at, max_usage, min_order_value, per_user_limit, used) VALUES
-- Percent discounts
('c5d6e7f8-1111-1111-1111-000000000001', '2024-05-01 00:00:00+07', '2024-05-01 00:00:00+07', true, 'GIẢM30K', 'FIXED_AMOUNT', 30000, '2024-05-01 00:00:00+07', '2024-12-31 23:59:59+07', 1000, 100000, 3, 156),
('c5d6e7f8-2222-2222-2222-000000000002', '2024-05-01 00:00:00+07', '2024-05-01 00:00:00+07', true, 'GIẢM25K', 'FIXED_AMOUNT', 25000, '2024-05-01 00:00:00+07', '2024-12-31 23:59:59+07', 800, 75000, 2, 134),
('c5d6e7f8-3333-3333-3333-000000000003', '2024-05-01 00:00:00+07', '2024-05-01 00:00:00+07', true, 'GIẢM15K', 'FIXED_AMOUNT', 15000, '2024-05-01 00:00:00+07', '2024-12-31 23:59:59+07', 2000, 50000, 5, 289),
('c5d6e7f8-4444-4444-4444-000000000004', '2024-05-01 00:00:00+07', '2024-05-01 00:00:00+07', true, 'GIẢM10K', 'FIXED_AMOUNT', 10000, '2024-05-01 00:00:00+07', '2024-12-31 23:59:59+07', 5000, 30000, 10, 512),
('c5d6e7f8-5555-5555-5555-000000000005', '2024-05-10 00:00:00+07', '2024-05-10 00:00:00+07', true, 'SALE50K', 'FIXED_AMOUNT', 50000, '2024-05-10 00:00:00+07', '2024-05-31 23:59:59+07', 500, 150000, 1, 234),
('c5d6e7f8-6666-6666-6666-000000000006', '2024-05-15 00:00:00+07', '2024-05-15 00:00:00+07', true, 'VIP35K', 'FIXED_AMOUNT', 35000, '2024-05-15 00:00:00+07', '2024-12-31 23:59:59+07', 300, 200000, 2, 89),
-- Percent discounts
('c5d6e7f8-7777-7777-7777-000000000007', '2024-05-01 00:00:00+07', '2024-05-01 00:00:00+07', true, 'SALE15PERCENT', 'PERCENT', 15, '2024-05-01 00:00:00+07', '2024-05-30 23:59:59+07', 400, 200000, 1, 78),
('c5d6e7f8-8888-8888-8888-000000000008', '2024-05-01 00:00:00+07', '2024-05-01 00:00:00+07', true, 'SAVE10PERCENT', 'PERCENT', 10, '2024-05-01 00:00:00+07', '2024-12-31 23:59:59+07', 1000, 100000, 3, 456),
-- Free shipping
('c5d6e7f8-9999-9999-9999-000000000009', '2024-05-01 00:00:00+07', '2024-05-01 00:00:00+07', true, 'FREESHIP', 'FREE_SHIP', 0, '2024-05-01 00:00:00+07', '2024-12-31 23:59:59+07', 2000, 50000, 5, 667),
('c5d6e7f8-0000-0000-0000-000000000010', '2024-05-01 00:00:00+07', '2024-05-01 00:00:00+07', true, 'FREESHIP30K', 'FREE_SHIP', 0, '2024-05-01 00:00:00+07', '2024-12-31 23:59:59+07', 500, 300000, 1, 123),
('c5d6e7f8-aaaa-aaaa-aaaa-000000000011', '2024-05-01 00:00:00+07', '2024-05-01 00:00:00+07', false, 'EXPIREDCODE', 'FIXED_AMOUNT', 20000, '2024-04-01 00:00:00+07', '2024-04-30 23:59:59+07', 100, 50000, 1, 95),
('c5d6e7f8-bbbb-bbbb-bbbb-000000000012', '2024-05-05 00:00:00+07', '2024-05-05 00:00:00+07', true, 'SUMMER20K', 'FIXED_AMOUNT', 20000, '2024-06-01 00:00:00+07', '2024-08-31 23:59:59+07', 1000, 80000, 2, 0);

-- ============================================================
-- 3a. BRANDS (10 thương hiệu mỹ phẩm)
-- ============================================================

INSERT INTO public.brands (id, name) VALUES
(1, 'Chanel'),
(2, 'Dior'),
(3, 'Lancôme'),
(4, 'Estée Lauder'),
(5, 'SK-II'),
(6, 'Shiseido'),
(7, 'MAC'),
(8, 'Benefit'),
(9, 'Clinique'),
(10, 'The Ordinary');

-- ============================================================
-- 3b. CATEGORIES (15 danh mục sản phẩm)
-- ============================================================

INSERT INTO public.categories (id, name, description, image_url, active, created_at, updated_at) VALUES
(1, 'Nước Hoa', 'Các loại nước hoa nam, nữ và unisex', 'https://placehold.co/300x200/png?text=Nuoc+Hoa', true, NOW(), NOW()),
(2, 'Trang Điểm Mặt', 'Son môi, phấn mắt, kem nền', 'https://placehold.co/300x200/png?text=Trang+Diem', true, NOW(), NOW()),
(3, 'Chăm Sóc Da', 'Sữa rửa mặt, toner, serum, kem dưỡng', 'https://placehold.co/300x200/png?text=Cham+Soc+Da', true, NOW(), NOW()),
(4, 'Dưỡng Tóc', 'Dầu gội, dầu xả, mặt nạ tóc', 'https://placehold.co/300x200/png?text=Duong+Toc', true, NOW(), NOW()),
(5, 'Chăm Sóc Cơ Thể', 'Sữa tắm, sữa dưỡng thể, kem dưỡng da', 'https://placehold.co/300x200/png?text=Co+The', true, NOW(), NOW()),
(6, 'Cọ Trang Điểm', 'Bộ cọ, cọ đơn, cọ chuyên dụng', 'https://placehold.co/300x200/png?text=Co+Makeup', true, NOW(), NOW()),
(7, 'Mặt Nạ', 'Mặt nạ giấy, mặt nạ đất sét, mặt nạ tuýp', 'https://placehold.co/300x200/png?text=Mat+Na', true, NOW(), NOW()),
(8, 'Mascara & Eyeliner', 'Mascara, eyeliner, chì kẻ mắt', 'https://placehold.co/300x200/png?text=Mascara', true, NOW(), NOW()),
(9, 'Kem Che Khuyết Điểm', 'Concealer, che khuyết điểm, phấn phủ', 'https://placehold.co/300x200/png?text=Concealer', true, NOW(), NOW()),
(10, 'Toner & Nước Hoa Hồng', 'Toner, nước hoa hồng, essence', 'https://placehold.co/300x200/png?text=Toner', true, NOW(), NOW()),
(11, 'Chứng Chỉ & Dưỡng Chất', 'Serum, tinh chất, ampoule', 'https://placehold.co/300x200/png?text=Serum', true, NOW(), NOW()),
(12, 'Phấn Phủ & Highlighter', 'Phấn phủ, highlighter, bronzer', 'https://placehold.co/300x200/png?text=Phan+Phu', true, NOW(), NOW()),
(13, 'Chế Độ Chăm Sóc Đặc Biệt', 'Mặt nạ ngủ, kem mắt, kem tay', 'https://placehold.co/300x200/png?text=Dac+Biet', true, NOW(), NOW()),
(14, 'Phụ Kiện Trang Điểm', 'Gương, lược, bao trang điểm', 'https://placehold.co/300x200/png?text=Phu+Kien', true, NOW(), NOW()),
(15, 'Dưỡng Môi', 'Son dưỡng, balsam, lip tint', 'https://placehold.co/300x200/png?text=Duong+Moi', true, NOW(), NOW()),
(16, 'Chăm Sóc Móng', 'Sơn móng, dưỡng móng, keo sơn', 'https://placehold.co/300x200/png?text=Cham+Soc+Mong', true, NOW(), NOW()),
(17, 'Chống Nắng', 'Kem chống nắng, spray chống tia UV', 'https://placehold.co/300x200/png?text=Chong+Nang', true, NOW(), NOW()),
(18, 'Xãi & Gội Đặc Biệt', 'Dầu xãi chuyên sâu, gội đặc biệt', 'https://placehold.co/300x200/png?text=Xai+Goi', true, NOW(), NOW()),
(19, 'Tắm & Vệ Sinh', 'Sữa tắm, gel vệ sinh, xà phòng tắm', 'https://placehold.co/300x200/png?text=Tam+Ve+Sinh', true, NOW(), NOW()),
(20, 'Bộ Quà Tặng', 'Bộ nước hoa, bộ skincare, combo sản phẩm', 'https://placehold.co/300x200/png?text=Bo+Qua+Tang', true, NOW(), NOW()),
(21, 'Công Cụ Chuyên Dụng', 'Máy massage, máy rửa mặt, công cụ lăn', 'https://placehold.co/300x200/png?text=Cong+Cu', true, NOW(), NOW());

-- ============================================================
-- 4. PRODUCTS (20 sản phẩm mỹ phẩm)
-- ============================================================

INSERT INTO public.products (id, brand_id, category_id, name, sku, short_desc, long_desc, listed_price, price, rating, active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 1, 1, 'Chanel No.5 Eau de Parfum 100ml', 'CHA-NO5-100', 'Nước hoa nữ huyền thoại', 'Nước hoa nữ huyền thoại, lâu lâu một lần nhấm nháp', 2500000, 2490000, 4.8, true),
('550e8400-e29b-41d4-a716-446655440002', 2, 2, 'Dior Lipstick Rouge Volupté', 'DIO-LIPS-RED', 'Son môi đỏ sang trọng', 'Son môi đỏ sang trọng, lâu trôi, bền màu', 850000, 790000, 4.6, true),
('550e8400-e29b-41d4-a716-446655440003', 3, 3, 'Lancôme Hydra Zen Moisturizer', 'LAN-HYDRA-50', 'Kem dưỡng ẩm Hydra Zen', 'Kem dưỡng ẩm cao cấp, dịu nhẹ, thích hợp cho da nhạy cảm', 1200000, 1150000, 4.7, true),
('550e8400-e29b-41d4-a716-446655440004', 5, 3, 'SK-II Facial Treatment Essence', 'SK2-FTE-160', 'Tinh chất dưỡng da SK-II', 'Tinh chất dưỡng da SK-II nổi tiếng thế giới', 2200000, 2100000, 4.9, true),
('550e8400-e29b-41d4-a716-446655440005', 6, 4, 'Shiseido Hair Care Shampoo', 'SHI-SHAM-200', 'Dầu gội Shiseido', 'Dầu gội chuyên dụng cho tóc khô xơ', 450000, 420000, 4.5, true),
('550e8400-e29b-41d4-a716-446655440006', 6, 4, 'Shiseido Hair Care Conditioner', 'SHI-COND-200', 'Dầu xả Shiseido', 'Dầu xả mềm mượt cho tóc', 450000, 410000, 4.4, true),
('550e8400-e29b-41d4-a716-446655440007', 7, 2, 'MAC Face Powder', 'MAC-POW-15', 'Phấn phủ MAC', 'Phấn phủ MAC chuyên nghiệp', 650000, 600000, 4.6, true),
('550e8400-e29b-41d4-a716-446655440008', 4, 1, 'Estée Lauder Beautiful Eau', 'EST-BEAU-100', 'Nước hoa nữ cao cấp', 'Nước hoa nữ cao cấp từ Estée Lauder', 2300000, 2200000, 4.7, true),
('550e8400-e29b-41d4-a716-446655440009', 8, 1, 'Benefit Rollerball Perfume', 'BEN-ROLLER-10', 'Nước hoa mini Benefit', 'Nước hoa mini tiện dụng từ Benefit', 450000, 380000, 4.3, true),
('550e8400-e29b-41d4-a716-446655440010', 9, 3, 'Clinique Moisturizing Lotion', 'CLI-MOIST-200', 'Sữa dưỡng da Clinique', 'Sữa dưỡng da từ Clinique', 1100000, 1000000, 4.5, true),
('550e8400-e29b-41d4-a716-446655440011', 10, 3, 'The Ordinary Niacinamide Serum', 'ORD-NIAC-30', 'Serum Niacinamide', 'Serum Niacinamide giảm mụn', 250000, 220000, 4.4, true),
('550e8400-e29b-41d4-a716-446655440012', 10, 3, 'The Ordinary Vitamin C', 'ORD-VITC-30', 'Serum Vitamin C', 'Serum Vitamin C sáng da', 280000, 250000, 4.5, true),
('550e8400-e29b-41d4-a716-446655440013', 3, 8, 'Lancôme Mascara Hypnôse', 'LAN-MASC-8', 'Mascara dày mi Lancôme', 'Mascara dày mi từ Lancôme', 750000, 680000, 4.7, true),
('550e8400-e29b-41d4-a716-446655440014', 1, 15, 'Chanel Rouge Coco Lip', 'CHA-LIP-RED', 'Son Chanel Rouge Coco', 'Son Chanel nổi tiếng', 850000, 790000, 4.8, true),
('550e8400-e29b-41d4-a716-446655440015', 7, 6, 'MAC Brush Set 12pcs', 'MAC-BRUSH-12', 'Bộ cọ trang điểm 12 cây', 'Bộ cọ trang điểm chuyên nghiệp', 1200000, 980000, 4.6, true),
('550e8400-e29b-41d4-a716-446655440016', 2, 3, 'Dior Cream Foundation', 'DIO-FOUND-30', 'Kem nền Dior', 'Kem nền cao cấp từ Dior', 1250000, 1150000, 4.7, true),
('550e8400-e29b-41d4-a716-446655440017', 5, 3, 'SK-II Stempower Cream', 'SK2-STEM-50', 'Kem dưỡng SK-II Stempower', 'Kem dưỡng cao cấp SK-II', 3200000, 3050000, 4.9, true),
('550e8400-e29b-41d4-a716-446655440018', 8, 7, 'Benefit Hydration Mask', 'BEN-MASK-50', 'Mặt nạ dưỡng ẩm Benefit', 'Mặt nạ dưỡng ẩm từ Benefit', 850000, 720000, 4.5, true),
('550e8400-e29b-41d4-a716-446655440019', 9, 10, 'Clinique Toner All Skin', 'CLI-TONE-200', 'Nước hoa hồng Clinique', 'Nước hoa hồng từ Clinique', 750000, 680000, 4.4, true),
('550e8400-e29b-41d4-a716-446655440020', 3, 5, 'Lancôme Body Lotion 200ml', 'LAN-BODY-200', 'Sữa dưỡng thể Lancôme', 'Sữa dưỡng thể từ Lancôme', 600000, 520000, 4.3, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 4a. INVENTORY (tồn kho cho các sản phẩm)
-- ============================================================

INSERT INTO public.inventory (product_id, on_hand, reserved) VALUES
('550e8400-e29b-41d4-a716-446655440001', 150, 12),
('550e8400-e29b-41d4-a716-446655440002', 200, 8),
('550e8400-e29b-41d4-a716-446655440003', 100, 5),
('550e8400-e29b-41d4-a716-446655440004', 50, 3),
('550e8400-e29b-41d4-a716-446655440005', 120, 8),
('550e8400-e29b-41d4-a716-446655440006', 180, 12),
('550e8400-e29b-41d4-a716-446655440007', 90, 6),
('550e8400-e29b-41d4-a716-446655440008', 40, 2),
('550e8400-e29b-41d4-a716-446655440009', 60, 4),
('550e8400-e29b-41d4-a716-446655440010', 75, 5),
('550e8400-e29b-41d4-a716-446655440011', 200, 15),
('550e8400-e29b-41d4-a716-446655440012', 150, 10),
('550e8400-e29b-41d4-a716-446655440013', 100, 8),
('550e8400-e29b-41d4-a716-446655440014', 80, 6),
('550e8400-e29b-41d4-a716-446655440015', 160, 12),
('550e8400-e29b-41d4-a716-446655440016', 120, 9),
('550e8400-e29b-41d4-a716-446655440017', 250, 20),
('550e8400-e29b-41d4-a716-446655440018', 55, 4),
('550e8400-e29b-41d4-a716-446655440019', 95, 7),
('550e8400-e29b-41d4-a716-446655440020', 140, 10)
ON CONFLICT (product_id) DO NOTHING;

-- ============================================================
-- 5. ORDERS (20 đơn hàng)
-- ============================================================

INSERT INTO public.orders (id, created_at, updated_at, status, payment_status, has_paid, discount_total, shipping_fee, sub_total, grand_total, shipping_address, user_id, discount_id, confirmed_at, cancelled_at) VALUES
('d7e8f9a0-1111-1111-1111-000000000001', '2024-05-10 08:30:00+07', '2024-05-10 15:45:00+07', 'DELIVERED', 'PAID', true, 30000, 30000, 1790000, 1790000, '{"name":"Nhà Minh","street":"123 Nguyễn Hữu Cảnh","ward":"Phường 22","province":"TPHCM"}'::jsonb, 'b2c3d4e5-0003-0003-0003-000000000003', 'c5d6e7f8-1111-1111-1111-000000000001', '2024-05-10 09:00:00+07', NULL),
('d7e8f9a0-2222-2222-2222-000000000002', '2024-05-11 10:00:00+07', '2024-05-13 14:00:00+07', 'IN_TRANSIT', 'PAID', true, 25000, 30000, 2350000, 2355000, '{"name":"Nhà Hương","street":"789 Cách Mạng Tháng 8","ward":"Phường Tân Lợi","province":"Hà Nội"}'::jsonb, 'b2c3d4e5-0004-0004-0004-000000000004', 'c5d6e7f8-2222-2222-2222-000000000002', '2024-05-11 11:00:00+07', NULL),
('d7e8f9a0-3333-3333-3333-000000000003', '2024-05-12 09:15:00+07', '2024-05-12 09:45:00+07', 'PENDING', 'UNPAID', false, 0, 30000, 890000, 920000, '{"name":"Nhà Đức","street":"654 Nguyễn Văn Linh","ward":"Hải Châu","province":"Đà Nẵng"}'::jsonb, 'b2c3d4e5-0005-0005-0005-000000000005', NULL, NULL, NULL),
('d7e8f9a0-4444-4444-4444-000000000004', '2024-05-12 14:30:00+07', '2024-05-14 10:00:00+07', 'DELIVERED', 'PAID', true, 0, 0, 3250000, 3250000, '{"name":"Nhà Linh","street":"987 Lê Thánh Tôn","ward":"Phường Tây Hồ","province":"Hà Nội"}'::jsonb, 'b2c3d4e5-0006-0006-0006-000000000006', 'c5d6e7f8-9999-9999-9999-000000000009', '2024-05-12 15:00:00+07', NULL),
('d7e8f9a0-5555-5555-5555-000000000005', '2024-05-13 11:00:00+07', '2024-05-13 11:30:00+07', 'WAITING_FOR_DELIVERY', 'PAID', true, 50000, 30000, 2100000, 2080000, '{"name":"Nhà Tuấn","street":"222 Võ Thị Sáu","ward":"Quận Hải Châu","province":"Đà Nẵng"}'::jsonb, 'b2c3d4e5-0007-0007-0007-000000000007', 'c5d6e7f8-5555-5555-5555-000000000005', '2024-05-13 11:30:00+07', NULL),
('d7e8f9a0-6666-6666-6666-000000000006', '2024-05-13 13:45:00+07', '2024-05-15 09:00:00+07', 'CANCELLED', 'FAILED', false, 0, 30000, 1450000, 1480000, '{"name":"Nhà An","street":"333 Trần Phú","ward":"Phường 9","province":"TPHCM"}'::jsonb, 'b2c3d4e5-0008-0008-0008-000000000008', NULL, NULL, '2024-05-14 10:00:00+07'),
('d7e8f9a0-7777-7777-7777-000000000007', '2024-05-14 08:00:00+07', '2024-05-14 08:30:00+07', 'CONFIRMED', 'PAID', true, 15000, 30000, 1650000, 1665000, '{"name":"Nhà Hạnh","street":"444 Đinh Bộ Lĩnh","ward":"Phường Tân Thành","province":"TPHCM"}'::jsonb, 'b2c3d4e5-0009-0009-0009-000000000009', 'c5d6e7f8-3333-3333-3333-000000000003', '2024-05-14 08:30:00+07', NULL),
('d7e8f9a0-8888-8888-8888-000000000008', '2024-05-14 16:20:00+07', '2024-05-14 16:50:00+07', 'PENDING', 'PENDING', false, 0, 30000, 2850000, 2880000, '{"name":"Nhà Nam","street":"666 Phan Bội Châu","ward":"Phường Tứ Xuyên","province":"Huế"}'::jsonb, 'b2c3d4e5-0010-0010-0010-000000000010', NULL, NULL, NULL),
('d7e8f9a0-9999-9999-9999-000000000009', '2024-05-15 09:30:00+07', '2024-05-15 09:45:00+07', 'WAITING_FOR_DELIVERY', 'PAID', true, 10000, 30000, 1920000, 1940000, '{"name":"Nhà Chi","street":"777 Hoàng Văn Thụ","ward":"Phường 2","province":"TPHCM"}'::jsonb, 'b2c3d4e5-0011-0011-0011-000000000011', 'c5d6e7f8-4444-4444-4444-000000000004', '2024-05-15 09:45:00+07', NULL),
('d7e8f9a0-0000-0000-0000-000000000010', '2024-05-15 10:15:00+07', '2024-05-15 10:45:00+07', 'PENDING', 'UNPAID', false, 0, 30000, 1120000, 1150000, '{"name":"Nhà Vinh","street":"999 Đồng Khởi","ward":"Phường Bến Nghé","province":"TPHCM"}'::jsonb, 'b2c3d4e5-0012-0012-0012-000000000012', NULL, NULL, NULL),
('d7e8f9a0-aaaa-aaaa-aaaa-000000000011', '2024-05-15 14:00:00+07', '2024-05-17 11:00:00+07', 'DELIVERED', 'PAID', true, 0, 0, 3580000, 3580000, '{"name":"Nhà Lan","street":"1010 Tôn Đức Thắng","ward":"Phường Bến Nghé","province":"TPHCM"}'::jsonb, 'b2c3d4e5-0013-0013-0013-000000000013', 'c5d6e7f8-9999-9999-9999-000000000009', '2024-05-15 14:30:00+07', NULL),
('d7e8f9a0-bbbb-bbbb-bbbb-000000000012', '2024-05-16 11:30:00+07', '2024-05-16 12:00:00+07', 'WAITING_FOR_DELIVERY', 'PAID', true, 30000, 30000, 2450000, 2450000, '{"name":"Nhà Khánh","street":"1111 Lê Quý Đôn","ward":"Phường 6","province":"TPHCM"}'::jsonb, 'b2c3d4e5-0014-0014-0014-000000000014', 'c5d6e7f8-1111-1111-1111-000000000001', '2024-05-16 12:00:00+07', NULL),
('d7e8f9a0-cccc-cccc-cccc-000000000013', '2024-05-16 15:00:00+07', '2024-05-18 13:00:00+07', 'DELIVERED', 'PAID', true, 25000, 30000, 1680000, 1685000, '{"name":"Nhà Huy","street":"1212 Hàng Gà","ward":"Phường Hoàn Kiếm","province":"Hà Nội"}'::jsonb, 'b2c3d4e5-0015-0015-0015-000000000015', 'c5d6e7f8-2222-2222-2222-000000000002', '2024-05-16 15:30:00+07', NULL),
('d7e8f9a0-dddd-dddd-dddd-000000000014', '2024-05-17 09:00:00+07', '2024-05-17 09:30:00+07', 'PENDING', 'UNPAID', false, 0, 30000, 2100000, 2130000, '{"name":"Nhà Minh","street":"456 Lê Văn Sỹ","ward":"Phường 14","province":"TPHCM"}'::jsonb, 'b2c3d4e5-0003-0003-0003-000000000003', NULL, NULL, NULL),
('d7e8f9a0-eeee-eeee-eeee-000000000015', '2024-05-17 11:20:00+07', '2024-05-17 11:50:00+07', 'CONFIRMED', 'PAID', true, 0, 0, 4200000, 4200000, '{"name":"Quán cà phê","street":"111 Nguyễn Du","ward":"Phường Bến Nghé","province":"TPHCM"}'::jsonb, 'b2c3d4e5-0006-0006-0006-000000000006', 'c5d6e7f8-9999-9999-9999-000000000009', '2024-05-17 11:50:00+07', NULL),
('d7e8f9a0-ffff-ffff-ffff-000000000016', '2024-05-17 14:45:00+07', '2024-05-19 10:00:00+07', 'IN_TRANSIT', 'PAID', true, 20000, 30000, 1950000, 1960000, '{"name":"Văn phòng","street":"555 Trần Hưng Đạo","ward":"Phường 1","province":"TPHCM"}'::jsonb, 'b2c3d4e5-0009-0009-0009-000000000009', 'c5d6e7f8-7777-7777-7777-000000000007', '2024-05-17 15:15:00+07', NULL),
('d7e8f9a0-1010-1010-1010-000000000017', '2024-05-18 08:30:00+07', '2024-05-18 09:00:00+07', 'WAITING_FOR_DELIVERY', 'PAID', true, 15000, 30000, 1580000, 1595000, '{"name":"Nhà bạn","street":"888 Nguyễn Huệ","ward":"Phường Bến Nghé","province":"TPHCM"}'::jsonb, 'b2c3d4e5-0011-0011-0011-000000000011', 'c5d6e7f8-3333-3333-3333-000000000003', '2024-05-18 09:00:00+07', NULL),
('d7e8f9a0-2020-2020-2020-000000000018', '2024-05-18 13:15:00+07', '2024-05-18 13:45:00+07', 'PENDING', 'PENDING', false, 0, 30000, 2680000, 2710000, '{"name":"Công ty Minh","street":"123 Nguyễn Hữu Cảnh","ward":"Phường 22","province":"TPHCM"}'::jsonb, 'b2c3d4e5-0003-0003-0003-000000000003', NULL, NULL, NULL),
('d7e8f9a0-3030-3030-3030-000000000019', '2024-05-18 16:00:00+07', '2024-05-20 12:00:00+07', 'DELIVERED', 'PAID', true, 0, 0, 1450000, 1450000, '{"name":"Nhà An","street":"333 Trần Phú","ward":"Phường 9","province":"TPHCM"}'::jsonb, 'b2c3d4e5-0008-0008-0008-000000000008', 'c5d6e7f8-9999-9999-9999-000000000009', '2024-05-18 16:30:00+07', NULL),
('d7e8f9a0-4040-4040-4040-000000000020', '2024-05-19 10:30:00+07', '2024-05-19 11:00:00+07', 'CONFIRMED', 'PAID', true, 35000, 30000, 2850000, 2845000, '{"name":"Nhà Linh","street":"987 Lê Thánh Tôn","ward":"Phường Tây Hồ","province":"Hà Nội"}'::jsonb, 'b2c3d4e5-0006-0006-0006-000000000006', 'c5d6e7f8-6666-6666-6666-000000000006', '2024-05-19 11:00:00+07', NULL);

-- ============================================================
-- 6. ORDER_ITEMS (30 mục đơn hàng)
-- ============================================================

INSERT INTO public.order_items (id, order_id, product_id, quantity, unit_price, line_total) VALUES
-- Order 1
(1, 'd7e8f9a0-1111-1111-1111-000000000001', '550e8400-e29b-41d4-a716-446655440001', 2, 790000, 1580000),
(2, 'd7e8f9a0-1111-1111-1111-000000000001', '550e8400-e29b-41d4-a716-446655440002', 1, 580000, 580000),
-- Order 2
(3, 'd7e8f9a0-2222-2222-2222-000000000002', '550e8400-e29b-41d4-a716-446655440008', 1, 2200000, 2200000),
(4, 'd7e8f9a0-2222-2222-2222-000000000002', '550e8400-e29b-41d4-a716-446655440014', 1, 250000, 250000),
-- Order 3
(5, 'd7e8f9a0-3333-3333-3333-000000000003', '550e8400-e29b-41d4-a716-446655440001', 1, 790000, 790000),
(6, 'd7e8f9a0-3333-3333-3333-000000000003', '550e8400-e29b-41d4-a716-446655440003', 1, 390000, 390000),
-- Order 4
(7, 'd7e8f9a0-4444-4444-4444-000000000004', '550e8400-e29b-41d4-a716-446655440009', 1, 1600000, 1600000),
(8, 'd7e8f9a0-4444-4444-4444-000000000004', '550e8400-e29b-41d4-a716-446655440010', 1, 1350000, 1350000),
(9, 'd7e8f9a0-4444-4444-4444-000000000004', '550e8400-e29b-41d4-a716-446655440018', 1, 580000, 580000),
-- Order 5
(10, 'd7e8f9a0-5555-5555-5555-000000000005', '550e8400-e29b-41d4-a716-446655440004', 2, 1050000, 2100000),
-- Order 6
(11, 'd7e8f9a0-6666-6666-6666-000000000006', '550e8400-e29b-41d4-a716-446655440011', 2, 400000, 800000),
(12, 'd7e8f9a0-6666-6666-6666-000000000006', '550e8400-e29b-41d4-a716-446655440012', 1, 320000, 320000),
(13, 'd7e8f9a0-6666-6666-6666-000000000006', '550e8400-e29b-41d4-a716-446655440013', 1, 480000, 480000),
-- Order 7
(14, 'd7e8f9a0-7777-7777-7777-000000000007', '550e8400-e29b-41d4-a716-446655440005', 1, 850000, 850000),
(15, 'd7e8f9a0-7777-7777-7777-000000000007', '550e8400-e29b-41d4-a716-446655440006', 1, 680000, 680000),
(16, 'd7e8f9a0-7777-7777-7777-000000000007', '550e8400-e29b-41d4-a716-446655440015', 1, 160000, 160000),
-- Order 8
(17, 'd7e8f9a0-8888-8888-8888-000000000008', '550e8400-e29b-41d4-a716-446655440007', 1, 750000, 750000),
(18, 'd7e8f9a0-8888-8888-8888-000000000008', '550e8400-e29b-41d4-a716-446655440002', 2, 580000, 1160000),
(19, 'd7e8f9a0-8888-8888-8888-000000000008', '550e8400-e29b-41d4-a716-446655440020', 1, 600000, 600000),
-- Order 9
(20, 'd7e8f9a0-9999-9999-9999-000000000009', '550e8400-e29b-41d4-a716-446655440008', 1, 2200000, 2200000),
-- Order 10
(21, 'd7e8f9a0-0000-0000-0000-000000000010', '550e8400-e29b-41d4-a716-446655440001', 1, 790000, 790000),
(22, 'd7e8f9a0-0000-0000-0000-000000000010', '550e8400-e29b-41d4-a716-446655440014', 1, 250000, 250000),
-- Order 11
(23, 'd7e8f9a0-aaaa-aaaa-aaaa-000000000011', '550e8400-e29b-41d4-a716-446655440010', 1, 1350000, 1350000),
(24, 'd7e8f9a0-aaaa-aaaa-aaaa-000000000011', '550e8400-e29b-41d4-a716-446655440009', 1, 1600000, 1600000),
(25, 'd7e8f9a0-aaaa-aaaa-aaaa-000000000011', '550e8400-e29b-41d4-a716-446655440004', 1, 1050000, 1050000),
-- Order 12
(26, 'd7e8f9a0-bbbb-bbbb-bbbb-000000000012', '550e8400-e29b-41d4-a716-446655440018', 3, 580000, 1740000),
(27, 'd7e8f9a0-bbbb-bbbb-bbbb-000000000012', '550e8400-e29b-41d4-a716-446655440015', 1, 160000, 160000),
-- Order 13
(28, 'd7e8f9a0-cccc-cccc-cccc-000000000013', '550e8400-e29b-41d4-a716-446655440001', 2, 790000, 1580000),
(29, 'd7e8f9a0-cccc-cccc-cccc-000000000013', '550e8400-e29b-41d4-a716-446655440003', 1, 390000, 390000);

-- ============================================================
-- 7. PAYMENTS (20 thanh toán)
-- ============================================================

INSERT INTO public.payments (id, created_at, updated_at, order_id, amount, method, provider, status, transaction_id, paid_at, gateway_response) VALUES
('e8f9a0b1-1111-1111-1111-000000000001', '2024-05-10 08:35:00+07', '2024-05-10 08:35:00+07', 'd7e8f9a0-1111-1111-1111-000000000001', 1790000, 'BANK_TRANSFER', 'VNPAY', 'PAID', 'VNP20240510001', '2024-05-10 08:35:00+07', '{"gateway":"VNPAY","status":"success"}'::jsonb),
('e8f9a0b1-2222-2222-2222-000000000002', '2024-05-11 10:05:00+07', '2024-05-11 10:05:00+07', 'd7e8f9a0-2222-2222-2222-000000000002', 2355000, 'E_WALLET', 'MOMO', 'PAID', 'MOMO20240511001', '2024-05-11 10:05:00+07', '{"gateway":"MOMO","status":"success"}'::jsonb),
('e8f9a0b1-3333-3333-3333-000000000003', '2024-05-12 09:20:00+07', '2024-05-12 09:20:00+07', 'd7e8f9a0-3333-3333-3333-000000000003', 920000, 'COD', 'NONE', 'PENDING', NULL, NULL, NULL),
('e8f9a0b1-4444-4444-4444-000000000004', '2024-05-12 14:35:00+07', '2024-05-12 14:35:00+07', 'd7e8f9a0-4444-4444-4444-000000000004', 3250000, 'BANK_TRANSFER', 'VNPAY', 'PAID', 'VNP20240512001', '2024-05-12 14:35:00+07', '{"gateway":"VNPAY","status":"success"}'::jsonb),
('e8f9a0b1-5555-5555-5555-000000000005', '2024-05-13 11:05:00+07', '2024-05-13 11:05:00+07', 'd7e8f9a0-5555-5555-5555-000000000005', 2080000, 'E_WALLET', 'MOMO', 'PAID', 'MOMO20240513001', '2024-05-13 11:05:00+07', '{"gateway":"MOMO","status":"success"}'::jsonb),
('e8f9a0b1-6666-6666-6666-000000000006', '2024-05-13 13:50:00+07', '2024-05-14 10:05:00+07', 'd7e8f9a0-6666-6666-6666-000000000006', 1480000, 'BANK_TRANSFER', 'VNPAY', 'FAILED', NULL, NULL, '{"gateway":"VNPAY","status":"failed","reason":"Card declined"}'::jsonb),
('e8f9a0b1-7777-7777-7777-000000000007', '2024-05-14 08:05:00+07', '2024-05-14 08:05:00+07', 'd7e8f9a0-7777-7777-7777-000000000007', 1665000, 'COD', 'NONE', 'PAID', NULL, '2024-05-14 08:05:00+07', NULL),
('e8f9a0b1-8888-8888-8888-000000000008', '2024-05-14 16:25:00+07', '2024-05-14 16:25:00+07', 'd7e8f9a0-8888-8888-8888-000000000008', 2880000, 'BANK_TRANSFER', 'VNPAY', 'PENDING', NULL, NULL, NULL),
('e8f9a0b1-9999-9999-9999-000000000009', '2024-05-15 09:35:00+07', '2024-05-15 09:35:00+07', 'd7e8f9a0-9999-9999-9999-000000000009', 1940000, 'E_WALLET', 'MOMO', 'PAID', 'MOMO20240515001', '2024-05-15 09:35:00+07', '{"gateway":"MOMO","status":"success"}'::jsonb),
('e8f9a0b1-0000-0000-0000-000000000010', '2024-05-15 10:20:00+07', '2024-05-15 10:20:00+07', 'd7e8f9a0-0000-0000-0000-000000000010', 1150000, 'COD', 'NONE', 'PENDING', NULL, NULL, NULL),
('e8f9a0b1-aaaa-aaaa-aaaa-000000000011', '2024-05-15 14:05:00+07', '2024-05-15 14:05:00+07', 'd7e8f9a0-aaaa-aaaa-aaaa-000000000011', 3580000, 'BANK_TRANSFER', 'VNPAY', 'PAID', 'VNP20240515002', '2024-05-15 14:05:00+07', '{"gateway":"VNPAY","status":"success"}'::jsonb),
('e8f9a0b1-bbbb-bbbb-bbbb-000000000012', '2024-05-16 11:35:00+07', '2024-05-16 11:35:00+07', 'd7e8f9a0-bbbb-bbbb-bbbb-000000000012', 2450000, 'E_WALLET', 'MOMO', 'PAID', 'MOMO20240516001', '2024-05-16 11:35:00+07', '{"gateway":"MOMO","status":"success"}'::jsonb),
('e8f9a0b1-cccc-cccc-cccc-000000000013', '2024-05-16 15:05:00+07', '2024-05-16 15:05:00+07', 'd7e8f9a0-cccc-cccc-cccc-000000000013', 1685000, 'COD', 'NONE', 'PAID', NULL, '2024-05-16 15:05:00+07', NULL),
('e8f9a0b1-dddd-dddd-dddd-000000000014', '2024-05-17 09:05:00+07', '2024-05-17 09:05:00+07', 'd7e8f9a0-dddd-dddd-dddd-000000000014', 2130000, 'BANK_TRANSFER', 'VNPAY', 'PENDING', NULL, NULL, NULL),
('e8f9a0b1-eeee-eeee-eeee-000000000015', '2024-05-17 11:25:00+07', '2024-05-17 11:25:00+07', 'd7e8f9a0-eeee-eeee-eeee-000000000015', 4200000, 'E_WALLET', 'MOMO', 'PAID', 'MOMO20240517001', '2024-05-17 11:25:00+07', '{"gateway":"MOMO","status":"success"}'::jsonb),
('e8f9a0b1-ffff-ffff-ffff-000000000016', '2024-05-17 14:50:00+07', '2024-05-17 14:50:00+07', 'd7e8f9a0-ffff-ffff-ffff-000000000016', 1960000, 'BANK_TRANSFER', 'VNPAY', 'PAID', 'VNP20240517001', '2024-05-17 14:50:00+07', '{"gateway":"VNPAY","status":"success"}'::jsonb),
('e8f9a0b1-1010-1010-1010-000000000017', '2024-05-18 08:35:00+07', '2024-05-18 08:35:00+07', 'd7e8f9a0-1010-1010-1010-000000000017', 1595000, 'COD', 'NONE', 'PAID', NULL, '2024-05-18 08:35:00+07', NULL),
('e8f9a0b1-2020-2020-2020-000000000018', '2024-05-18 13:20:00+07', '2024-05-18 13:20:00+07', 'd7e8f9a0-2020-2020-2020-000000000018', 2710000, 'BANK_TRANSFER', 'VNPAY', 'PENDING', NULL, NULL, NULL),
('e8f9a0b1-3030-3030-3030-000000000019', '2024-05-18 16:05:00+07', '2024-05-18 16:05:00+07', 'd7e8f9a0-3030-3030-3030-000000000019', 1450000, 'E_WALLET', 'MOMO', 'PAID', 'MOMO20240518001', '2024-05-18 16:05:00+07', '{"gateway":"MOMO","status":"success"}'::jsonb),
('e8f9a0b1-4040-4040-4040-000000000020', '2024-05-19 10:35:00+07', '2024-05-19 10:35:00+07', 'd7e8f9a0-4040-4040-4040-000000000020', 2845000, 'E_WALLET', 'MOMO', 'PAID', 'MOMO20240519001', '2024-05-19 10:35:00+07', '{"gateway":"MOMO","status":"success"}'::jsonb);

-- ============================================================
-- 8. SHIPMENTS (18 vận chuyển)
-- ============================================================

INSERT INTO public.shipments (order_id, status, carrier, shipped_at, delivered_at) VALUES
('d7e8f9a0-1111-1111-1111-000000000001', 'DELIVERED', 'GHN', '2024-05-10 16:00:00+07', '2024-05-12 14:30:00+07'),
('d7e8f9a0-2222-2222-2222-000000000002', 'IN_TRANSIT', 'GHTK', '2024-05-12 09:00:00+07', NULL),
('d7e8f9a0-4444-4444-4444-000000000004', 'DELIVERED', 'GHN', '2024-05-13 10:00:00+07', '2024-05-15 11:20:00+07'),
('d7e8f9a0-5555-5555-5555-000000000005', 'IN_TRANSIT', 'GHTK', '2024-05-14 08:00:00+07', NULL),
('d7e8f9a0-7777-7777-7777-000000000007', 'IN_TRANSIT', 'GHN', '2024-05-15 10:00:00+07', NULL),
('d7e8f9a0-9999-9999-9999-000000000009', 'IN_TRANSIT', 'GHTK', '2024-05-16 08:30:00+07', NULL),
('d7e8f9a0-aaaa-aaaa-aaaa-000000000011', 'DELIVERED', 'GHN', '2024-05-16 09:00:00+07', '2024-05-17 16:45:00+07'),
('d7e8f9a0-bbbb-bbbb-bbbb-000000000012', 'IN_TRANSIT', 'GHTK', '2024-05-17 08:00:00+07', NULL),
('d7e8f9a0-cccc-cccc-cccc-000000000013', 'DELIVERED', 'GHN', '2024-05-17 09:00:00+07', '2024-05-18 20:15:00+07'),
('d7e8f9a0-eeee-eeee-eeee-000000000015', 'DELIVERED', 'GHTK', '2024-05-18 09:00:00+07', '2024-05-19 15:30:00+07'),
('d7e8f9a0-ffff-ffff-ffff-000000000016', 'IN_TRANSIT', 'GHN', '2024-05-18 10:30:00+07', NULL),
('d7e8f9a0-1010-1010-1010-000000000017', 'IN_TRANSIT', 'GHTK', '2024-05-19 08:00:00+07', NULL),
('d7e8f9a0-3030-3030-3030-000000000019', 'DELIVERED', 'GHN', '2024-05-19 08:30:00+07', '2024-05-20 17:00:00+07'),
('d7e8f9a0-4040-4040-4040-000000000020', 'IN_TRANSIT', 'GHTK', '2024-05-20 09:00:00+07', NULL);

-- ============================================================
-- 9. REVIEWS (10 đánh giá sản phẩm)
-- ============================================================

INSERT INTO public.reviews (product_id, user_id, order_item_id, rating, comment, status, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'b2c3d4e5-0003-0003-0003-000000000003', 1, 5, 'Sản phẩm rất tốt, màu sắc đẹp, bền màu. Hài lòng với chất lượng!', 'APPROVED', '2024-05-12 18:00:00+07'),
('550e8400-e29b-41d4-a716-446655440002', 'b2c3d4e5-0004-0004-0004-000000000004', 2, 4, 'Son môi màu sắc đẹp, bền màu tốt. Nhưng hơi khô chút.', 'APPROVED', '2024-05-13 19:30:00+07'),
('550e8400-e29b-41d4-a716-446655440008', 'b2c3d4e5-0005-0005-0005-000000000005', 3, 5, 'Nước hoa huyền thoại, mùi thơm lâu, rất lịch sự. Đáng mua!', 'APPROVED', '2024-05-15 20:00:00+07'),
('550e8400-e29b-41d4-a716-446655440009', 'b2c3d4e5-0007-0007-0007-000000000007', 7, 4, 'Hương thơm nữ tính, kéo dài cả ngày. Giá hơi cao một chút.', 'APPROVED', '2024-05-16 17:45:00+07'),
('550e8400-e29b-41d4-a716-446655440010', 'b2c3d4e5-0008-0008-0008-000000000008', 8, 5, 'Nước hoa tươi sáng, dễ chịu. Rất thích!', 'APPROVED', '2024-05-17 18:20:00+07'),
('550e8400-e29b-41d4-a716-446655440004', 'b2c3d4e5-0009-0009-0009-000000000009', 10, 5, 'Kem mắt rất hiệu quả, làm giảm nếp nhăn. Sẽ mua tiếp!', 'APPROVED', '2024-05-18 09:00:00+07'),
('550e8400-e29b-41d4-a716-446655440005', 'b2c3d4e5-0010-0010-0010-000000000010', 14, 4, 'Serum vitamin C làm sáng da, không kích ứng. OK!', 'APPROVED', '2024-05-18 10:30:00+07'),
('550e8400-e29b-41d4-a716-446655440006', 'b2c3d4e5-0011-0011-0011-000000000011', 15, 4, 'Toner cân bằng độ ẩm tốt, ko quá kích ứng da.', 'APPROVED', '2024-05-18 14:15:00+07'),
('550e8400-e29b-41d4-a716-446655440018', 'b2c3d4e5-0012-0012-0012-000000000012', 26, 5, 'Máy massage mặt rất tiện dụng, da mềm mịn sau dùng.', 'APPROVED', '2024-05-19 16:30:00+07'),
('550e8400-e29b-41d4-a716-446655440014', 'b2c3d4e5-0014-0014-0014-000000000014', 27, 5, 'Bộ cọ trang điểm chất lượng, có 12 cây đủ dùng.', 'APPROVED', '2024-05-19 18:45:00+07');

-- ============================================================
-- 10. SUPPORT TICKETS (8 vé hỗ trợ)
-- ============================================================

INSERT INTO public.support_tickets (id, user_id, title, subject, content, status, created_at) VALUES
('f9a0b1c2-1111-1111-1111-000000000001', 'b2c3d4e5-0003-0003-0003-000000000003', 'Hỏi về sản phẩm', 'Inquiry', 'Sản phẩm có hết hàng không? Tôi muốn mua thêm.', 'RESOLVED', '2024-05-10 10:00:00+07'),
('f9a0b1c2-2222-2222-2222-000000000002', 'b2c3d4e5-0004-0004-0004-000000000004', 'Vấn đề giao hàng', 'Issue', 'Đơn hàng của tôi bị mất, hãy giúp tôi!', 'IN_PROGRESS', '2024-05-13 14:30:00+07'),
('f9a0b1c2-3333-3333-3333-000000000003', 'b2c3d4e5-0005-0005-0005-000000000005', 'Trả hàng sản phẩm', 'Return', 'Tôi muốn trả lại sản phẩm bị lỗi.', 'OPEN', '2024-05-14 09:15:00+07'),
('f9a0b1c2-4444-4444-4444-000000000004', 'b2c3d4e5-0006-0006-0006-000000000006', 'Hỏi về chính sách', 'Policy', 'Chính sách đổi trả của bạn là gì?', 'RESOLVED', '2024-05-15 11:20:00+07'),
('f9a0b1c2-5555-5555-5555-000000000005', 'b2c3d4e5-0008-0008-0008-000000000008', 'Vấn đề thanh toán', 'Payment', 'Thanh toán thất bại, đã trừ tiền nhưng chưa nhận đơn.', 'IN_PROGRESS', '2024-05-16 13:45:00+07'),
('f9a0b1c2-6666-6666-6666-000000000006', 'b2c3d4e5-0009-0009-0009-000000000009', 'Đổi hàng', 'Exchange', 'Tôi muốn đổi size khác.', 'OPEN', '2024-05-17 10:00:00+07'),
('f9a0b1c2-7777-7777-7777-000000000007', 'b2c3d4e5-0010-0010-0010-000000000010', 'Hỏi về giá', 'Pricing', 'Có khuyến mãi không?', 'RESOLVED', '2024-05-18 15:30:00+07'),
('f9a0b1c2-8888-8888-8888-000000000008', 'b2c3d4e5-0012-0012-0012-000000000012', 'Lỗi sản phẩm', 'Defect', 'Sản phẩm tôi nhận bị hỏng, xin phép trả lại.', 'OPEN', '2024-05-19 09:00:00+07');

-- ============================================================
-- 11. WARRANTY_REQUESTS (6 yêu cầu bảo hành)
-- ============================================================

INSERT INTO public.warranty_requests (order_item_id, issue_type, description, status, requested_at, resolved_at) VALUES
(4, 'DEFECTIVE', 'Sản phẩm bị lỗi chức năng sau 2 tuần sử dụng', 'REPAIRED', '2024-05-13 10:00:00+07', '2024-05-20 16:00:00+07'),
(8, 'DAMAGED_SHIPPING', 'Sản phẩm tới bị rơi, gây hư hỏng', 'REPLACED', '2024-05-14 11:30:00+07', '2024-05-18 14:00:00+07'),
(12, 'DEFECTIVE', 'Màu sắc không như mô tả, bị phai nhanh', 'ACCEPTED', '2024-05-15 09:00:00+07', NULL),
(14, 'NOT_AS_DESCRIBED', 'Kích cỡ không vừa, gửi lại để đổi', 'SUBMITTED', '2024-05-17 14:00:00+07', NULL),
(18, 'DEFECTIVE', 'Hộp đựng bị nước thâm vào', 'REJECTED', '2024-05-18 10:30:00+07', '2024-05-19 09:00:00+07'),
(24, 'DAMAGED_SHIPPING', 'Vỡ gương, không thể sử dụng', 'RETURNED', '2024-05-19 11:00:00+07', '2024-05-21 10:00:00+07');

-- ============================================================
-- 12. ARTICLES (5 bài viết blog)
-- ============================================================

INSERT INTO public.articles (id, admin_id, title, slug, summary, content, published_at, active) VALUES
('a0b1c2d3-1111-1111-1111-000000000001', 'a1b2c3d4-0001-0001-0001-000000000001', 'Cách Chọn Kem Nền Phù Hợp Với Làn Da', 'cach-chon-kem-nen-phu-hop', 'Hướng dẫn chọn kem nền phù hợp cho từng loại da', '<h2>Giới thiệu</h2><p>Kem nền là sản phẩm trang điểm quan trọng nhất. Bài viết này sẽ hướng dẫn bạn cách chọn kem nền phù hợp.</p><p>Hãy xem xét loại da của bạn: da khô, da dầu hay da hỗn hợp. Mỗi loại da cần một công thức kem nền khác nhau.</p>', '2024-05-01 10:00:00+07', true),
('a0b1c2d3-2222-2222-2222-000000000002', 'a1b2c3d4-0001-0001-0001-000000000001', 'Bí Quyết Chăm Sóc Da Ban Đêm', 'bi-quyet-cham-soc-da-ban-dem', 'Các bước chăm sóc da tối ưu trước khi ngủ', '<h2>Tại sao chăm sóc da ban đêm quan trọng?</h2><p>Da phục hồi nhanh nhất vào ban đêm. Một quy trình chăm sóc da tốt trước ngủ sẽ giúp da bạn luôn khỏe mạnh.</p><h3>Các bước cơ bản:</h3><ul><li>Tẩy trang</li><li>Rửa mặt</li><li>Sử dụng toner</li><li>Đắp mặt nạ</li><li>Dưỡng ẩm</li></ul>', '2024-05-05 14:30:00+07', true),
('a0b1c2d3-3333-3333-3333-000000000003', 'a1b2c3d4-0002-0002-0002-000000000002', 'Top 10 Nước Hoa Nữ Được Yêu Thích Nhất', 'top-10-nuoc-hoa-nu-duoc-yeu-thich', 'Danh sách 10 nước hoa nữ tốt nhất hiện nay', '<h2>Nước Hoa Nữ Huyền Thoại</h2><p>Dưới đây là danh sách 10 nước hoa nữ được yêu thích nhất trên thế giới...</p><ol><li>Chanel No.5</li><li>Dior Miss Dior</li><li>Lancôme La Vie Est Belle</li></ol>', '2024-05-08 11:00:00+07', true),
('a0b1c2d3-4444-4444-4444-000000000004', 'a1b2c3d4-0002-0002-0002-000000000002', 'Hướng Dẫn Chọn Cọ Trang Điểm Chuyên Nghiệp', 'huong-dan-chon-co-trang-diem', 'Cách lựa chọn bộ cọ trang điểm chuyên nghiệp', '<h2>Tại sao cọ trang điểm lại quan trọng?</h2><p>Cọ trang điểm chất lượng giúp trang điểm đẹp hơn, lâu trôi hơn...</p>', '2024-05-12 09:30:00+07', true),
('a0b1c2d3-5555-5555-5555-000000000005', 'a1b2c3d4-0001-0001-0001-000000000001', 'Dùng Serum Vitamin C Đúng Cách', 'dung-serum-vitamin-c-dung-cach', 'Hướng dẫn sử dụng serum vitamin C để có hiệu quả tối đa', '<h2>Lợi Ích Của Serum Vitamin C</h2><p>Serum vitamin C giúp làm sáng da, giảm thâm, chống lão hóa...</p><p>Để có hiệu quả tối đa, bạn nên sử dụng serum vào buổi sáng sau khi tẩy trang và rửa mặt.</p>', '2024-05-15 16:00:00+07', true);

-- Summary
SELECT 'Seed data hoàn tất!' as status;
SELECT COUNT(*) as total_users FROM public.users;
SELECT COUNT(*) as total_addresses FROM public.addresses;
SELECT COUNT(*) as total_orders FROM public.orders;
SELECT COUNT(*) as total_order_items FROM public.order_items;
SELECT COUNT(*) as total_payments FROM public.payments;
SELECT COUNT(*) as total_shipments FROM public.shipments;
SELECT COUNT(*) as total_reviews FROM public.reviews;
SELECT COUNT(*) as total_support_tickets FROM public.support_tickets;
SELECT COUNT(*) as total_warranty_requests FROM public.warranty_requests;
SELECT COUNT(*) as total_articles FROM public.articles;
SELECT COUNT(*) as total_discounts FROM public.discounts;
