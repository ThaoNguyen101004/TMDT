-- ============================================================
-- SEED DATA - Lumière Beauty (Cosmetics Store)
-- Thứ tự import đúng theo FK dependency
-- ============================================================

-- ============================================================
-- 1. USERS - SKIP (Users already created via registration form)
-- ============================================================
-- To add more users, use the registration form or add manually via Supabase
-- If you need to create admin users, update role in database directly

-- ============================================================
-- 2. BRANDS (8 thương hiệu mỹ phẩm)
-- ============================================================
INSERT INTO public.brands (id, name) VALUES
(1, 'Dior'),
(2, 'Chanel'),
(3, 'MAC'),
(4, 'Estée Lauder'),
(5, 'Shiseido'),
(6, 'Lancôme'),
(7, 'Maybelline'),
(8, 'L''Oréal')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 3. CATEGORIES (10 danh mục)
-- ============================================================
INSERT INTO public.categories (id, active, created_at, updated_at, description, name) VALUES
(1, true, NOW(), NOW(), 'Sản phẩm trang điểm và màu sắc', 'Trang Điểm'),
(2, true, NOW(), NOW(), 'Chăm sóc và dưỡng da', 'Skincare'),
(3, true, NOW(), NOW(), 'Nước hoa và mùi hương', 'Nước Hoa'),
(4, true, NOW(), NOW(), 'Chăm sóc tóc và cơ thể', 'Body Care'),
(5, true, NOW(), NOW(), 'Công cụ và phụ kiện', 'Tools & Accessories'),
(6, true, NOW(), NOW(), 'Tẩy trang, làm sạch mặt', 'Tẩy Trang'),
(7, true, NOW(), NOW(), 'Son môi, tint môi, gloss', 'Son Môi'),
(8, true, NOW(), NOW(), 'Kem chống nắng, bảo vệ da', 'Kem Chống Nắng'),
(9, true, NOW(), NOW(), 'Mặt nạ dưỡng ẩm, làm sáng', 'Mặt Nạ'),
(10, true, NOW(), NOW(), 'Phụ kiện chăm sóc và trang điểm', 'Phụ Kiện')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 4. PRODUCTS (20 sản phẩm mỹ phẩm)
-- ============================================================
INSERT INTO public.products (id, created_at, updated_at, active, deleted_at, listed_price, long_desc, name, price, rating, review_count, short_desc, sku, thumbnail_url, brand_id, category_id) VALUES
-- Trang Điểm
('550e8400-e29b-41d4-a716-446655440001', NOW(), NOW(), true, NULL, 890000, 'Son môi bền màu 24h với độ mềm mượt hoàn hảo', 'Dior Addict Lipstick', 790000, 4.8, 145, 'Son môi cao cấp từ Dior', 'DIOR-ADDICT-001', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500', 1, 1),
('550e8400-e29b-41d4-a716-446655440002', NOW(), NOW(), true, NULL, 650000, 'Phấn mắt 16 màu với công thức lâu trôi', 'Chanel Eyeshadow Palette', 580000, 4.9, 203, 'Bộ phấn mắt Chanel cao cấp', 'CHANEL-SHADOW-001', 'https://images.unsplash.com/photo-1596881220622-c2b96e45f2d2?w=500', 2, 1),
('550e8400-e29b-41d4-a716-446655440003', NOW(), NOW(), true, NULL, 450000, 'Lót mắt bền màu, không nổi mụn', 'MAC Fix+', 390000, 4.7, 98, 'Xịt cố định trang điểm', 'MAC-FIX-001', 'https://images.unsplash.com/photo-1631214174585-fe5582dc711c?w=500', 3, 1),
-- Skincare
('550e8400-e29b-41d4-a716-446655440004', NOW(), NOW(), true, NULL, 1200000, 'Kem dưỡng da vùng mắt chống lão hóa', 'Estée Lauder Eye Cream Advanced', 1050000, 4.9, 287, 'Kem mắt chống lão hóa cao cấp', 'ESTEE-EYE-001', 'https://images.unsplash.com/photo-1570194676612-56d50b9b0400?w=500', 4, 2),
('550e8400-e29b-41d4-a716-446655440005', NOW(), NOW(), true, NULL, 950000, 'Serum vitamin C làm sáng da, giảm thâm', 'Shiseido Vital-Perfection Serum', 850000, 4.8, 156, 'Serum vitamin C từ Shiseido', 'SHISEIDO-VIT-C-001', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500', 5, 2),
('550e8400-e29b-41d4-a716-446655440006', NOW(), NOW(), true, NULL, 750000, 'Nước toner cân bằng độ ẩm cho da', 'Lancôme Tonique Confort', 680000, 4.7, 134, 'Toner dưỡng ẩm Lancôme', 'LANCOME-TONER-001', 'https://images.unsplash.com/photo-1556228041-e3121717d13f?w=500', 6, 2),
('550e8400-e29b-41d4-a716-446655440007', NOW(), NOW(), true, NULL, 850000, 'Kem dưỡng ban đêm phục hồi da tổn thương', 'Dior Prestige Night Cream', 750000, 4.8, 189, 'Kem đêm cao cấp từ Dior', 'DIOR-NIGHT-001', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500', 1, 2),
-- Nước Hoa
('550e8400-e29b-41d4-a716-446655440008', NOW(), NOW(), true, NULL, 2500000, 'Nước hoa nữ hương thơm lâu 12h, tone hoa đơn', 'Chanel No.5 Eau de Parfum', 2200000, 5.0, 412, 'Nước hoa nữ huyền thoại từ Chanel', 'CHANEL-NO5-100ML', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500', 2, 3),
('550e8400-e29b-41d4-a716-446655440009', NOW(), NOW(), true, NULL, 1800000, 'Nước hoa nữ mùi hoa cây gỗ, lưu hương 10h', 'Dior Miss Dior Eau de Parfum', 1600000, 4.9, 356, 'Nước hoa nữ tính từ Dior', 'DIOR-MISS-100ML', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500', 1, 3),
('550e8400-e29b-41d4-a716-446655440010', NOW(), NOW(), true, NULL, 1500000, 'Nước hoa nữ mùi cam ngọt, lưu hương 8h', 'Lancôme La Vie Est Belle', 1350000, 4.8, 298, 'Nước hoa nữ tươi sáng Lancôme', 'LANCOME-LAVIE-100ML', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500', 6, 3),
-- Body Care
('550e8400-e29b-41d4-a716-446655440011', NOW(), NOW(), true, NULL, 450000, 'Sữa dưỡng thể hương hoa, mịn mượt cơ thể', 'Shiseido Body Lotion', 400000, 4.6, 112, 'Sữa dưỡng thể Shiseido', 'SHISEIDO-BODY-001', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500', 5, 4),
('550e8400-e29b-41d4-a716-446655440012', NOW(), NOW(), true, NULL, 350000, 'Xà phòng cục thơm lâu, dưỡng da', 'Dior Bar Soap', 320000, 4.7, 89, 'Xà phòng cao cấp Dior', 'DIOR-SOAP-001', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500', 1, 4),
('550e8400-e29b-41d4-a716-446655440013', NOW(), NOW(), true, NULL, 520000, 'Kem tẩy lông an toàn, không đau', 'Maybelline Hair Removal Cream', 480000, 4.5, 76, 'Kem tẩy lông Maybelline', 'MAYBELLINE-HAIR-001', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500', 7, 4),
-- Tools & Accessories
('550e8400-e29b-41d4-a716-446655440014', NOW(), NOW(), true, NULL, 280000, 'Cọ trang điểm 12 cây chuyên nghiệp', 'MAC Brush Set 12pcs', 250000, 4.8, 167, 'Bộ cọ trang điểm MAC', 'MAC-BRUSH-12', 'https://images.unsplash.com/photo-1596881220622-c2b96e45f2d2?w=500', 3, 5),
('550e8400-e29b-41d4-a716-446655440015', NOW(), NOW(), true, NULL, 180000, 'Gương cầm tay có đèn LED', 'LED Mirror Makeup', 160000, 4.6, 124, 'Gương trang điểm có đèn', 'LED-MIRROR-001', 'https://images.unsplash.com/photo-1596881220622-c2b96e45f2d2?w=500', 8, 5),
('550e8400-e29b-41d4-a716-446655440016', NOW(), NOW(), true, NULL, 420000, 'Hộp đựng mỹ phẩm tổ chức gọn gàng', 'Makeup Organizer Box', 380000, 4.7, 95, 'Hộp đựng mỹ phẩm', 'ORG-BOX-001', 'https://images.unsplash.com/photo-1596881220622-c2b96e45f2d2?w=500', 8, 5),
('550e8400-e29b-41d4-a716-446655440017', NOW(), NOW(), true, NULL, 150000, 'Gối trang điểm làm sạch cọ hiệu quả', 'Brush Cleaner Sponge', 130000, 4.5, 68, 'Gối rửa cọ trang điểm', 'BRUSH-CLEAN-001', 'https://images.unsplash.com/photo-1596881220622-c2b96e45f2d2?w=500', 8, 5),
('550e8400-e29b-41d4-a716-446655440018', NOW(), NOW(), true, NULL, 650000, 'Máy massage mặt ion, chống lão hóa', 'Facial Massage Device', 580000, 4.9, 203, 'Máy massage mặt cao cấp', 'MASSAGE-ION-001', 'https://images.unsplash.com/photo-1596881220622-c2b96e45f2d2?w=500', 8, 5),
('550e8400-e29b-41d4-a716-446655440019', NOW(), NOW(), true, NULL, 890000, 'Kem nền full coverage, tự nhiên', 'MAC Face & Body Foundation', 800000, 4.8, 234, 'Kem nền MAC chuyên nghiệp', 'MAC-FOUNDATION-001', 'https://images.unsplash.com/photo-1596881220622-c2b96e45f2d2?w=500', 3, 1),
('550e8400-e29b-41d4-a716-446655440020', NOW(), NOW(), true, NULL, 650000, 'Huyết thanh dưỡng chuyên sâu', 'Estée Lauder Advanced Serum', 600000, 4.9, 178, 'Huyết thanh chuyên sâu Estée Lauder', 'ESTEE-SERUM-ADV', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500', 4, 2)
ON CONFLICT (sku) DO NOTHING;

-- ============================================================
-- 5. MEDIA_ASSETS (ảnh sản phẩm) - OPTIONAL
-- ============================================================
-- Media assets can be added manually via Supabase or through the admin panel
-- Skipping to avoid foreign key issues with product IDs

-- ============================================================
-- 6. INVENTORY (tồn kho cho sản phẩm) - OPTIONAL
-- ============================================================
-- Inventory management can be added through the admin panel
-- or adjusted based on your specific inventory table schema
-- Skipping to avoid schema mismatches
