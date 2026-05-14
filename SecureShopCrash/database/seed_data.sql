-- ============================================================
-- SEED DATA - Website Bán Máy Ảnh
-- Thứ tự import đúng theo FK dependency
-- ============================================================

-- ============================================================
-- 1. USERS (8 người dùng: 2 admin, 6 user)
-- ============================================================
-- password_hash là bcrypt của "Password123!" cho tất cả
INSERT INTO public.users (id, created_at, updated_at, avatar_url, deleted_at, email, enabled, name, password_hash, phone, provider, role) VALUES
(
  'a1b2c3d4-0001-0001-0001-000000000001',
  '2024-01-10 08:00:00+07',
  '2024-01-10 08:00:00+07',
  'https://placehold.co/150x150/png?text=Admin1',
  NULL,
  'admin@camstore.vn',
  true,
  'Nguyễn Quản Trị',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  '0901000001',
  'LOCAL',
  'ADMIN'
),
(
  'a1b2c3d4-0002-0002-0002-000000000002',
  '2024-01-15 09:00:00+07',
  '2024-01-15 09:00:00+07',
  'https://placehold.co/150x150/png?text=Admin2',
  NULL,
  'admin2@camstore.vn',
  true,
  'Trần Thị Hoa',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  '0901000002',
  'LOCAL',
  'ADMIN'
),
(
  'a1b2c3d4-0003-0003-0003-000000000003',
  '2024-02-01 10:00:00+07',
  '2024-02-01 10:00:00+07',
  'https://placehold.co/150x150/png?text=User1',
  NULL,
  'minh.nguyen@gmail.com',
  true,
  'Nguyễn Văn Minh',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  '0912345601',
  'LOCAL',
  'USER'
),
(
  'a1b2c3d4-0004-0004-0004-000000000004',
  '2024-02-10 11:00:00+07',
  '2024-02-10 11:00:00+07',
  'https://placehold.co/150x150/png?text=User2',
  NULL,
  'huong.tran@gmail.com',
  true,
  'Trần Thị Hương',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  '0912345602',
  'GOOGLE',
  'USER'
),
(
  'a1b2c3d4-0005-0005-0005-000000000005',
  '2024-02-20 12:00:00+07',
  '2024-02-20 12:00:00+07',
  'https://placehold.co/150x150/png?text=User3',
  NULL,
  'duc.le@gmail.com',
  true,
  'Lê Văn Đức',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  '0912345603',
  'LOCAL',
  'USER'
),
(
  'a1b2c3d4-0006-0006-0006-000000000006',
  '2024-03-01 08:30:00+07',
  '2024-03-01 08:30:00+07',
  'https://placehold.co/150x150/png?text=User4',
  NULL,
  'linh.pham@gmail.com',
  true,
  'Phạm Thị Linh',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  '0912345604',
  'GOOGLE',
  'USER'
),
(
  'a1b2c3d4-0007-0007-0007-000000000007',
  '2024-03-15 14:00:00+07',
  '2024-03-15 14:00:00+07',
  NULL,
  NULL,
  'tuan.vo@gmail.com',
  true,
  'Võ Minh Tuấn',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  '0912345605',
  'LOCAL',
  'USER'
),
(
  'a1b2c3d4-0008-0008-0008-000000000008',
  '2024-04-01 09:00:00+07',
  '2024-04-01 09:00:00+07',
  NULL,
  NULL,
  'an.hoang@gmail.com',
  false,
  'Hoàng Thị An',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  '0912345606',
  'LOCAL',
  'USER'
);

-- ============================================================
-- 2. BRANDS (10 thương hiệu máy ảnh)
-- brands dùng IDENTITY nên không cần truyền id
-- ============================================================
INSERT INTO public.brands (id, name) OVERRIDING SYSTEM VALUE VALUES
(1, 'Canon'),
(2, 'Nikon'),
(3, 'Sony'),
(4, 'Fujifilm'),
(5, 'Panasonic'),
(6, 'Olympus'),
(7, 'Leica'),
(8, 'Sigma'),
(9, 'Tamron'),
(10, 'Godox');

-- Reset sequence để tránh conflict
SELECT setval('brands_id_seq', 10);

-- ============================================================
-- 3. CATEGORIES (8 danh mục)
-- ============================================================
INSERT INTO public.categories (id, active, created_at, description, image_url, name, updated_at) OVERRIDING SYSTEM VALUE VALUES
(1, true, '2024-01-10 08:00:00+07', 'Máy ảnh phản xạ ống kính đơn, chất lượng cao cho nhiếp ảnh gia chuyên nghiệp và bán chuyên.', 'https://placehold.co/400x300/png?text=DSLR', 'Máy ảnh DSLR', '2024-01-10 08:00:00+07'),
(2, true, '2024-01-10 08:00:00+07', 'Máy ảnh không gương lật hiện đại, nhỏ gọn với chất lượng hình ảnh vượt trội.', 'https://placehold.co/400x300/png?text=Mirrorless', 'Máy ảnh Mirrorless', '2024-01-10 08:00:00+07'),
(3, true, '2024-01-10 08:00:00+07', 'Ống kính chất lượng cao cho mọi nhu cầu chụp ảnh từ góc rộng đến tele.', 'https://placehold.co/400x300/png?text=Lens', 'Ống kính', '2024-01-10 08:00:00+07'),
(4, true, '2024-01-10 08:00:00+07', 'Đèn flash và thiết bị chiếu sáng chuyên nghiệp cho studio và outdoor.', 'https://placehold.co/400x300/png?text=Flash', 'Đèn Flash & Ánh sáng', '2024-01-10 08:00:00+07'),
(5, true, '2024-01-10 08:00:00+07', 'Túi, balo, hộp đựng máy ảnh bảo vệ thiết bị an toàn khi di chuyển.', 'https://placehold.co/400x300/png?text=Bag', 'Túi & Balo Máy Ảnh', '2024-01-10 08:00:00+07'),
(6, true, '2024-01-10 08:00:00+07', 'Pin, sạc, thẻ nhớ và phụ kiện năng lượng cho máy ảnh.', 'https://placehold.co/400x300/png?text=Battery', 'Pin & Phụ Kiện', '2024-01-10 08:00:00+07'),
(7, true, '2024-01-10 08:00:00+07', 'Chân máy, đầu pan-tilt và thiết bị hỗ trợ ổn định hình ảnh.', 'https://placehold.co/400x300/png?text=Tripod', 'Chân Máy & Gimbal', '2024-01-10 08:00:00+07'),
(8, true, '2024-01-10 08:00:00+07', 'Bộ lọc ND, UV, CPL và các filter sáng tạo cho ống kính.', 'https://placehold.co/400x300/png?text=Filter', 'Bộ Lọc & Filter', '2024-01-10 08:00:00+07');

SELECT setval('categories_id_seq', 8);

-- ============================================================
-- 4. PRODUCTS (30 sản phẩm)
-- ============================================================
INSERT INTO public.products (id, created_at, updated_at, active, deleted_at, listed_price, long_desc, name, price, rating, review_count, short_desc, sku, thumbnail_url, brand_id, category_id) VALUES

-- Canon DSLR (cat 1, brand 1)
(
  '11111111-0001-0001-0001-000000000001',
  '2024-01-20 08:00:00+07', '2024-01-20 08:00:00+07',
  true, NULL,
  32990000.00,
  'Canon EOS 90D là máy ảnh DSLR cao cấp với cảm biến APS-C 32.5MP, tốc độ chụp liên tiếp 10fps, quay video 4K không crop. Hệ thống lấy nét Dual Pixel CMOS AF với 45 điểm AF chéo cho phép lấy nét nhanh và chính xác trong mọi điều kiện ánh sáng. Màn hình xoay lật 3 inch cảm ứng 1.04 triệu điểm, kết nối WiFi và Bluetooth tiện lợi.',
  'Canon EOS 90D Body',
  30990000.00, 4.7, 0,
  'Máy ảnh DSLR 32.5MP, 4K video, 10fps, Dual Pixel AF, màn hình xoay lật cảm ứng',
  'CAM-CAN-90D-BODY',
  'https://placehold.co/600x400/png?text=Canon+EOS+90D',
  1, 1
),
(
  '11111111-0002-0002-0002-000000000002',
  '2024-01-20 08:00:00+07', '2024-01-20 08:00:00+07',
  true, NULL,
  18990000.00,
  'Canon EOS 250D là máy ảnh DSLR nhỏ gọn nhất thế giới với cảm biến APS-C 24.1MP, màn hình xoay lật cảm ứng 3 inch. Hỗ trợ quay video Full HD 60fps, tích hợp hướng dẫn sử dụng ngay trên máy rất phù hợp cho người mới học chụp ảnh.',
  'Canon EOS 250D Kit 18-55mm',
  16990000.00, 4.5, 0,
  'Máy ảnh DSLR nhỏ gọn 24.1MP, màn hình xoay lật, kèm lens 18-55mm IS II',
  'CAM-CAN-250D-KIT',
  'https://placehold.co/600x400/png?text=Canon+EOS+250D',
  1, 1
),
(
  '11111111-0003-0003-0003-000000000003',
  '2024-01-20 08:00:00+07', '2024-01-20 08:00:00+07',
  true, NULL,
  85000000.00,
  'Canon EOS 5D Mark IV là máy ảnh DSLR Full Frame huyền thoại với cảm biến 30.4MP, tốc độ chụp 7fps, quay video 4K, hệ thống AF 61 điểm trong đó 41 điểm chéo. Chống thấm nước và bụi, xây dựng chắc chắn cho nhiếp ảnh gia chuyên nghiệp.',
  'Canon EOS 5D Mark IV Body',
  80000000.00, 4.9, 0,
  'DSLR Full Frame 30.4MP, 4K video, 7fps, 61 điểm AF, chống thấm',
  'CAM-CAN-5D4-BODY',
  'https://placehold.co/600x400/png?text=Canon+5D+Mark+IV',
  1, 1
),

-- Nikon DSLR (cat 1, brand 2)
(
  '11111111-0004-0004-0004-000000000004',
  '2024-01-21 08:00:00+07', '2024-01-21 08:00:00+07',
  true, NULL,
  28500000.00,
  'Nikon D7500 là máy ảnh DSLR APS-C với cảm biến 20.9MP BSI-CMOS, tốc độ chụp 8fps, quay video 4K UHD, bộ đệm ảnh lớn 100 RAW. Màn hình xoay lật 3.2 inch, chống thấm nước và bụi, pin bền bỉ lên đến 950 ảnh.',
  'Nikon D7500 Body',
  26500000.00, 4.6, 0,
  'DSLR APS-C 20.9MP BSI, 4K video, 8fps, bộ đệm 100 RAW, chống thấm',
  'CAM-NIK-D7500-BODY',
  'https://placehold.co/600x400/png?text=Nikon+D7500',
  2, 1
),
(
  '11111111-0005-0005-0005-000000000005',
  '2024-01-21 08:00:00+07', '2024-01-21 08:00:00+07',
  true, NULL,
  75000000.00,
  'Nikon D850 là đỉnh cao của dòng DSLR Full Frame với cảm biến 45.7MP BSI-CMOS back-illuminated, tốc độ chụp 7fps (9fps với grip), quay video 4K timelapse không crop. Hệ thống AF Multi-CAM 20K với 153 điểm AF.',
  'Nikon D850 Body',
  70000000.00, 4.9, 0,
  'DSLR Full Frame 45.7MP BSI, 4K video, 153 điểm AF, chống thấm cao cấp',
  'CAM-NIK-D850-BODY',
  'https://placehold.co/600x400/png?text=Nikon+D850',
  2, 1
),

-- Sony Mirrorless (cat 2, brand 3)
(
  '11111111-0006-0006-0006-000000000006',
  '2024-01-22 08:00:00+07', '2024-01-22 08:00:00+07',
  true, NULL,
  52000000.00,
  'Sony A7 IV là máy ảnh Mirrorless Full Frame thế hệ mới nhất với cảm biến BSI-CMOS 33MP, bộ xử lý BIONZ XR, quay video 4K 60fps không crop 10-bit, tốc độ chụp 10fps. Hệ thống AF Real-time Tracking với 759 điểm AF phase detection bao phủ 94% khung hình.',
  'Sony A7 IV Body',
  48000000.00, 4.8, 0,
  'Mirrorless Full Frame 33MP, 4K 60fps 10-bit, 759 điểm AF, chống rung 5 trục',
  'CAM-SNY-A7IV-BODY',
  'https://placehold.co/600x400/png?text=Sony+A7+IV',
  3, 2
),
(
  '11111111-0007-0007-0007-000000000007',
  '2024-01-22 08:00:00+07', '2024-01-22 08:00:00+07',
  true, NULL,
  26500000.00,
  'Sony ZV-E10 là máy ảnh Mirrorless APS-C tối ưu cho content creator và vlogger. Cảm biến 24.2MP, quay video 4K, màn hình xoay lật 180 độ, micro tích hợp 3 chiều chống gió, kết nối không dây thuận tiện.',
  'Sony ZV-E10 Kit 16-50mm',
  24500000.00, 4.4, 0,
  'Mirrorless APS-C 24.2MP cho vlogger, 4K video, màn hình lật 180 độ, mic 3 chiều',
  'CAM-SNY-ZVE10-KIT',
  'https://placehold.co/600x400/png?text=Sony+ZV-E10',
  3, 2
),
(
  '11111111-0008-0008-0008-000000000008',
  '2024-01-22 08:00:00+07', '2024-01-22 08:00:00+07',
  true, NULL,
  120000000.00,
  'Sony A1 là máy ảnh Mirrorless Full Frame đỉnh cao với cảm biến Stacked BSI-CMOS 50.1MP, tốc độ chụp 30fps không rung màn trập, quay video 8K 30fps và 4K 120fps, hệ thống AF với 759 điểm phase detection.',
  'Sony A1 Body',
  115000000.00, 5.0, 0,
  'Mirrorless Full Frame 50.1MP Stacked, 8K video, 30fps, 759 điểm AF',
  'CAM-SNY-A1-BODY',
  'https://placehold.co/600x400/png?text=Sony+A1',
  3, 2
),

-- Fujifilm Mirrorless (cat 2, brand 4)
(
  '11111111-0009-0009-0009-000000000009',
  '2024-01-23 08:00:00+07', '2024-01-23 08:00:00+07',
  true, NULL,
  46000000.00,
  'Fujifilm X-T5 là máy ảnh Mirrorless APS-C với cảm biến X-Trans CMOS 5 HR 40.2MP, thiết kế retro cổ điển với các dial cơ học, chống rung IBIS 7 stop, quay video 6.2K RAW. Màu sắc đặc trưng Fujifilm với 20 Film Simulation.',
  'Fujifilm X-T5 Body',
  43000000.00, 4.7, 0,
  'Mirrorless APS-C 40.2MP X-Trans, thiết kế retro, IBIS 7-stop, 20 Film Simulation',
  'CAM-FUJ-XT5-BODY',
  'https://placehold.co/600x400/png?text=Fujifilm+X-T5',
  4, 2
),
(
  '11111111-0010-0010-0010-000000000010',
  '2024-01-23 08:00:00+07', '2024-01-23 08:00:00+07',
  true, NULL,
  20000000.00,
  'Fujifilm X-S20 là máy ảnh Mirrorless APS-C phù hợp cho người mới bắt đầu đến bán chuyên. Cảm biến 26.1MP, màn hình xoay lật 3 chiều, quay video 6.2K, pin dung lượng lớn. Thiết kế thân thiện người dùng với nút bấm trực quan.',
  'Fujifilm X-S20 Body',
  18500000.00, 4.5, 0,
  'Mirrorless APS-C 26.1MP, màn hình 3 chiều, 6.2K video, pin lớn, thân thiện người dùng',
  'CAM-FUJ-XS20-BODY',
  'https://placehold.co/600x400/png?text=Fujifilm+X-S20',
  4, 2
),

-- Ống kính Canon (cat 3, brand 1)
(
  '11111111-0011-0011-0011-000000000011',
  '2024-01-24 08:00:00+07', '2024-01-24 08:00:00+07',
  true, NULL,
  22000000.00,
  'Canon RF 24-70mm f/2.8L IS USM là ống kính zoom tiêu chuẩn cao cấp cho hệ thống Canon RF. Khẩu độ tối đa f/2.8 xuyên suốt dải zoom, chống rung IS lên đến 5 stop, mô tơ USM lấy nét cực nhanh và êm. Chất lượng quang học L-series đỉnh cao.',
  'Canon RF 24-70mm f/2.8L IS USM',
  20500000.00, 4.8, 0,
  'Ống kính zoom L-series f/2.8, IS 5 stop, USM lấy nét nhanh cho Canon RF',
  'LENS-CAN-RF2470-F28',
  'https://placehold.co/600x400/png?text=Canon+RF+24-70+f2.8',
  1, 3
),
(
  '11111111-0012-0012-0012-000000000012',
  '2024-01-24 08:00:00+07', '2024-01-24 08:00:00+07',
  true, NULL,
  11000000.00,
  'Canon EF 50mm f/1.4 USM là ống kính tiêu cự chuẩn cổ điển với khẩu độ tối đa f/1.4 cho bokeh đẹp. Mô tơ USM lấy nét nhanh và êm ái, tương thích với tất cả máy ảnh Canon EF mount. Lý tưởng cho chụp chân dung và nhiếp ảnh ánh sáng yếu.',
  'Canon EF 50mm f/1.4 USM',
  9500000.00, 4.6, 0,
  'Ống kính nifty fifty f/1.4 USM cho Canon EF, bokeh đẹp, ánh sáng yếu xuất sắc',
  'LENS-CAN-EF50-F14',
  'https://placehold.co/600x400/png?text=Canon+EF+50mm+f1.4',
  1, 3
),

-- Ống kính Sony (cat 3, brand 3)
(
  '11111111-0013-0013-0013-000000000013',
  '2024-01-25 08:00:00+07', '2024-01-25 08:00:00+07',
  true, NULL,
  35000000.00,
  'Sony FE 24-70mm f/2.8 GM II là ống kính zoom tiêu chuẩn G Master thế hệ 2 nhẹ hơn 20% so với thế hệ trước, 4 mô tơ XD Linear lấy nét cực nhanh, chất lượng quang học vượt trội với 15 lá khẩu tạo bokeh tròn đẹp.',
  'Sony FE 24-70mm f/2.8 GM II',
  33000000.00, 4.9, 0,
  'Ống kính G Master zoom f/2.8 thế hệ 2 nhẹ hơn, 4 mô tơ XD Linear, 15 lá khẩu',
  'LENS-SNY-FE2470-GM2',
  'https://placehold.co/600x400/png?text=Sony+FE+24-70+GM2',
  3, 3
),
(
  '11111111-0014-0014-0014-000000000014',
  '2024-01-25 08:00:00+07', '2024-01-25 08:00:00+07',
  true, NULL,
  8500000.00,
  'Sigma 35mm f/1.4 DG DN Art là ống kính tiêu cự góc rộng cao cấp cho ngàm Sony E và L-mount. Thiết kế optical mới hoàn toàn tối ưu cho mirrorless, chống thấm nước và bụi, lấy nét cực nhanh và êm.',
  'Sigma 35mm f/1.4 DG DN Art (Sony E)',
  7800000.00, 4.7, 0,
  'Ống kính Art 35mm f/1.4 tối ưu mirrorless Sony E, chống thấm, optical mới hoàn toàn',
  'LENS-SIG-35-F14-SONY',
  'https://placehold.co/600x400/png?text=Sigma+35mm+f1.4+Art',
  8, 3
),

-- Ống kính Tamron (cat 3, brand 9)
(
  '11111111-0015-0015-0015-000000000015',
  '2024-01-26 08:00:00+07', '2024-01-26 08:00:00+07',
  true, NULL,
  16500000.00,
  'Tamron 28-75mm f/2.8 Di III VXD G2 là ống kính zoom tiêu chuẩn thế hệ 2 cho Sony FE. Mô tơ VXD lấy nét nhanh hơn 40% thế hệ đầu, BBAR-G2 coating chống flare, trọng lượng nhẹ 540g, chống thấm toàn thân.',
  'Tamron 28-75mm f/2.8 Di III VXD G2 (Sony E)',
  14500000.00, 4.6, 0,
  'Zoom 28-75mm f/2.8 G2 cho Sony E, VXD AF nhanh, nhẹ 540g, chống thấm',
  'LENS-TAM-2875-G2-SONY',
  'https://placehold.co/600x400/png?text=Tamron+28-75+G2',
  9, 3
),

-- Đèn flash Godox (cat 4, brand 10)
(
  '11111111-0016-0016-0016-000000000016',
  '2024-01-27 08:00:00+07', '2024-01-27 08:00:00+07',
  true, NULL,
  4200000.00,
  'Godox V860III là đèn flash TTL dùng pin Li-ion với GN60, hỗ trợ HSS đến 1/8000s, thời gian sạc nhanh 1.5s, pin lithium dùng được 650 lần nháy. Hỗ trợ đa thương hiệu Canon, Nikon, Sony, Fuji, Olympus.',
  'Godox V860III TTL Flash',
  3800000.00, 4.5, 0,
  'Flash TTL GN60 pin Li-ion, HSS 1/8000s, sạc 1.5s, 650 lần nháy, đa thương hiệu',
  'FLASH-GDX-V860III',
  'https://placehold.co/600x400/png?text=Godox+V860III',
  10, 4
),
(
  '11111111-0017-0017-0017-000000000017',
  '2024-01-27 08:00:00+07', '2024-01-27 08:00:00+07',
  true, NULL,
  9500000.00,
  'Godox AD200Pro là đèn flash portable 200W với 2 đầu flash (bulb và Fresnel), sạc nhanh 0.01-2.1s, pin Li-ion 2000 lần nháy full power, hỗ trợ HSS và TTL, màn hình LCD hiển thị thông số rõ ràng.',
  'Godox AD200Pro Portable Flash 200W',
  8800000.00, 4.7, 0,
  'Flash portable 200W, 2 đầu flash, sạc 0.01-2.1s, 2000 lần nháy, HSS TTL',
  'FLASH-GDX-AD200PRO',
  'https://placehold.co/600x400/png?text=Godox+AD200Pro',
  10, 4
),
(
  '11111111-0018-0018-0018-000000000018',
  '2024-01-27 08:00:00+07', '2024-01-27 08:00:00+07',
  true, NULL,
  32000000.00,
  'Godox SK400II Studio Kit bao gồm 2 đèn monolight 400W mỗi cái, 2 softbox octa 90cm, 2 chân đèn, 1 bộ trigger X1. Lý tưởng cho studio chân dung, sản phẩm. Công suất đủ mạnh cho không gian studio vừa và lớn.',
  'Bộ Đèn Studio Godox SK400II Kit (2 đèn)',
  29000000.00, 4.6, 0,
  'Bộ studio 2 đèn 400W + 2 softbox octa 90cm + chân đèn + trigger, đủ cho studio vừa',
  'FLASH-GDX-SK400II-KIT2',
  'https://placehold.co/600x400/png?text=Godox+SK400II+Kit',
  10, 4
),

-- Túi máy ảnh (cat 5)
(
  '11111111-0019-0019-0019-000000000019',
  '2024-01-28 08:00:00+07', '2024-01-28 08:00:00+07',
  true, NULL,
  1850000.00,
  'Balo Lowepro ProTactic 450 AW II là balo chuyên nghiệp chứa được thân máy + 6-8 ống kính hoặc laptop 15 inch, cấu trúc khung thép bên trong, chống thấm nước, vải chống rách Ballistic Nylon, dây kéo YKK.',
  'Balo Lowepro ProTactic 450 AW II',
  1650000.00, 4.5, 0,
  'Balo chuyên nghiệp chứa thân + 8 lens + laptop, khung thép, Ballistic Nylon, chống thấm',
  'BAG-LPR-PROTACTIC450',
  'https://placehold.co/600x400/png?text=Lowepro+ProTactic+450',
  5, 5
),
(
  '11111111-0020-0020-0020-000000000020',
  '2024-01-28 08:00:00+07', '2024-01-28 08:00:00+07',
  true, NULL,
  850000.00,
  'Túi đeo chéo Domke F-803 Camera Satchel là túi vải canvas truyền thống của nhà báo ảnh, chứa được 1 thân máy + 3-4 ống kính, chất liệu canvas bền bỉ, dây đeo rộng thoải mái, nhiều ngăn tiện dụng.',
  'Túi Đeo Chéo Domke F-803 Canvas',
  750000.00, 4.3, 0,
  'Túi canvas truyền thống cho nhà báo, chứa thân + 4 lens, bền bỉ, dây rộng',
  'BAG-DMK-F803-CANVAS',
  'https://placehold.co/600x400/png?text=Domke+F-803',
  5, 5
),

-- Pin & phụ kiện (cat 6)
(
  '11111111-0021-0021-0021-000000000021',
  '2024-01-29 08:00:00+07', '2024-01-29 08:00:00+07',
  true, NULL,
  680000.00,
  'Pin Sony NP-FZ100 chính hãng dung lượng 2280mAh, tương thích Sony A7 III, A7 IV, A7R IV, A9, A9 II, A7C. Dung lượng lớn gấp 2.2 lần pin cũ NP-FW50, chụp được khoảng 610-710 ảnh mỗi lần sạc.',
  'Pin Sony NP-FZ100 Chính Hãng',
  580000.00, 4.7, 0,
  'Pin chính hãng 2280mAh cho Sony A7 III/IV/R IV/A9, 610-710 ảnh/lần sạc',
  'BAT-SNY-NPFZ100',
  'https://placehold.co/600x400/png?text=Sony+NP-FZ100',
  3, 6
),
(
  '11111111-0022-0022-0022-000000000022',
  '2024-01-29 08:00:00+07', '2024-01-29 08:00:00+07',
  true, NULL,
  2200000.00,
  'Thẻ nhớ Sony SF-M256T TOUGH CFexpress Type A 256GB tốc độ đọc 800MB/s, ghi 700MB/s. Thiết kế TOUGH 1 mảnh liền không khe hở, chịu được lực bẻ cong 18N, chống thấm nước, chịu nhiệt độ -25°C đến 85°C.',
  'Thẻ Nhớ Sony CFexpress Type A 256GB TOUGH',
  2000000.00, 4.8, 0,
  'CFexpress Type A 256GB TOUGH, đọc 800MB/s, ghi 700MB/s, chống va đập nước nhiệt',
  'MEM-SNY-CFA256-TOUGH',
  'https://placehold.co/600x400/png?text=Sony+CFexpress+256GB',
  3, 6
),

-- Chân máy (cat 7)
(
  '11111111-0023-0023-0023-000000000023',
  '2024-01-30 08:00:00+07', '2024-01-30 08:00:00+07',
  true, NULL,
  5500000.00,
  'Chân máy Gitzo GT1545T Series 1 Traveler là chân máy carbon fiber siêu nhẹ 1.19kg, tải trọng 10kg, chiều cao tối đa 148.5cm, gập lại chỉ 40.5cm nhờ cơ chế gập ngược. Phù hợp cho du lịch và chụp phong cảnh.',
  'Chân Máy Gitzo GT1545T Series 1 Traveler Carbon',
  5000000.00, 4.8, 0,
  'Tripod carbon fiber siêu nhẹ 1.19kg, tải 10kg, gập ngược 40.5cm, cho du lịch',
  'TRP-GTZ-GT1545T',
  'https://placehold.co/600x400/png?text=Gitzo+GT1545T',
  5, 7
),
(
  '11111111-0024-0024-0024-000000000024',
  '2024-01-30 08:00:00+07', '2024-01-30 08:00:00+07',
  true, NULL,
  12000000.00,
  'DJI RS 3 Pro là gimbal 3 trục cho máy ảnh mirrorless và DSLR tải trọng lên đến 4.5kg. Thiết kế trục carbon, tự động cân bằng bằng mô tơ, kết nối HDMI và USB-C, màn hình cảm ứng 1.8 inch, thời gian dùng 12 giờ.',
  'DJI RS 3 Pro Gimbal Stabilizer',
  10500000.00, 4.6, 0,
  'Gimbal 3 trục tải 4.5kg, tự động cân bằng, màn hình 1.8 inch, dùng 12 giờ',
  'GIM-DJI-RS3PRO',
  'https://placehold.co/600x400/png?text=DJI+RS3+Pro',
  5, 7
),

-- Filter (cat 8)
(
  '11111111-0025-0025-0025-000000000025',
  '2024-01-31 08:00:00+07', '2024-01-31 08:00:00+07',
  true, NULL,
  1500000.00,
  'Bộ filter K&F Concept ND Variable 77mm cho phép điều chỉnh ND2 đến ND400 liên tục. Coating nano chống phản xạ, khung mỏng không vignette, chất liệu kính quang học AGC Nhật Bản, phù hợp quay video và chụp ảnh phơi sáng dài.',
  'Filter ND Variable K&F Concept 77mm ND2-ND400',
  1300000.00, 4.4, 0,
  'ND Variable 77mm điều chỉnh ND2-400, nano coating, kính AGC Nhật, phù hợp video',
  'FLT-KFC-ND-VAR-77',
  'https://placehold.co/600x400/png?text=K%26F+ND+Variable+77mm',
  5, 8
),
(
  '11111111-0026-0026-0026-000000000026',
  '2024-01-31 08:00:00+07', '2024-01-31 08:00:00+07',
  true, NULL,
  950000.00,
  'Filter CPL B+W XS-Pro Digital MRC Nano 77mm là filter phân cực tròn cao cấp của Đức, lớp phủ MRC Nano 16 lớp chống phản xạ, chống nước và bụi, khung đồng thau mỏng, loại bỏ phản xạ kính và nước hiệu quả.',
  'Filter CPL B+W XS-Pro MRC Nano 77mm',
  850000.00, 4.7, 0,
  'CPL cao cấp Đức, 16 lớp MRC Nano coating, khung đồng thau mỏng, chống nước bụi',
  'FLT-BW-CPL-MRC-77',
  'https://placehold.co/600x400/png?text=B%2BW+CPL+77mm',
  5, 8
),

-- Thêm một số sản phẩm khác để đủ 30
(
  '11111111-0027-0027-0027-000000000027',
  '2024-02-01 08:00:00+07', '2024-02-01 08:00:00+07',
  true, NULL,
  68000000.00,
  'Leica M11 là máy ảnh rangefinder kỹ thuật số cao cấp với cảm biến BSI Full Frame 60MP, thiết kế kim loại toàn bộ, màn hình 2.3 inch, lưu ảnh DNG và JPEG. Trải nghiệm chụp ảnh đích thực với cơ chế đo sáng và lấy nét truyền thống của Leica.',
  'Leica M11 Body',
  65000000.00, 4.9, 0,
  'Rangefinder Full Frame 60MP BSI, thiết kế kim loại, DNG thuần túy, trải nghiệm Leica',
  'CAM-LEI-M11-BODY',
  'https://placehold.co/600x400/png?text=Leica+M11',
  7, 2
),
(
  '11111111-0028-0028-0028-000000000028',
  '2024-02-01 08:00:00+07', '2024-02-01 08:00:00+07',
  true, NULL,
  38000000.00,
  'Olympus OM-1 Mark II là máy ảnh Mirrorless Micro Four Thirds với cảm biến 20.4MP BSI Live MOS, chống rung IBIS 8.5 stop, chống thấm đạt chuẩn IP53, tốc độ chụp 50fps silent, AF Computational bao gồm nhận diện bird và racing car.',
  'Olympus OM-1 Mark II Body',
  35000000.00, 4.7, 0,
  'Mirrorless MFT 20.4MP, IBIS 8.5 stop, IP53 chống thấm, 50fps silent, AI AF',
  'CAM-OLY-OM1MK2-BODY',
  'https://placehold.co/600x400/png?text=Olympus+OM-1+II',
  6, 2
),
(
  '11111111-0029-0029-0029-000000000029',
  '2024-02-02 08:00:00+07', '2024-02-02 08:00:00+07',
  true, NULL,
  3500000.00,
  'Sigma 18-50mm f/2.8 DC DN Contemporary là ống kính zoom APS-C nhỏ gọn nhất thế giới ở phân khúc f/2.8. Thiết kế tối ưu cho mirrorless APS-C, mô tơ stepping lấy nét êm cho video, khẩu độ f/2.8 xuyên suốt, chống thấm.',
  'Sigma 18-50mm f/2.8 DC DN Contemporary (Sony E)',
  3200000.00, 4.5, 0,
  'Zoom APS-C f/2.8 nhỏ gọn nhất thế giới, stepping motor, chống thấm, Sony E',
  'LENS-SIG-1850-F28-SONY',
  'https://placehold.co/600x400/png?text=Sigma+18-50+f2.8',
  8, 3
),
(
  '11111111-0030-0030-0030-000000000030',
  '2024-02-02 08:00:00+07', '2024-02-02 08:00:00+07',
  true, NULL,
  4800000.00,
  'Panasonic Lumix S 50mm f/1.8 là ống kính prime tiêu cự chuẩn cho L-mount, cấu trúc quang học 9 thấu kính 8 nhóm, màng nano coating chống phản xạ, 9 lá khẩu bo tròn tạo bokeh đẹp, lấy nét nhanh và êm, chống thấm.',
  'Panasonic Lumix S 50mm f/1.8 (L-mount)',
  4200000.00, 4.6, 0,
  'Prime 50mm f/1.8 L-mount, 9 thấu kính, nano coating, 9 lá khẩu bo tròn, chống thấm',
  'LENS-PAN-S50-F18-LMNT',
  'https://placehold.co/600x400/png?text=Panasonic+S+50mm',
  5, 3
);

-- ============================================================
-- 5. MEDIA_ASSETS (60 ảnh - 2 ảnh mỗi sản phẩm)
-- ============================================================
INSERT INTO public.media_assets (alt_text, url, product_id) VALUES
-- prod 01 - Canon EOS 90D
('Canon EOS 90D mặt trước', 'https://placehold.co/800x600/png?text=Canon+90D+Front', '11111111-0001-0001-0001-000000000001'),
('Canon EOS 90D mặt sau', 'https://placehold.co/800x600/png?text=Canon+90D+Back', '11111111-0001-0001-0001-000000000001'),
-- prod 02 - Canon EOS 250D
('Canon EOS 250D Kit mặt trước', 'https://placehold.co/800x600/png?text=Canon+250D+Front', '11111111-0002-0002-0002-000000000002'),
('Canon EOS 250D màn hình lật', 'https://placehold.co/800x600/png?text=Canon+250D+Screen', '11111111-0002-0002-0002-000000000002'),
-- prod 03 - Canon 5D Mark IV
('Canon 5D Mark IV mặt trước', 'https://placehold.co/800x600/png?text=Canon+5D4+Front', '11111111-0003-0003-0003-000000000003'),
('Canon 5D Mark IV góc nghiêng', 'https://placehold.co/800x600/png?text=Canon+5D4+Angle', '11111111-0003-0003-0003-000000000003'),
-- prod 04 - Nikon D7500
('Nikon D7500 mặt trước', 'https://placehold.co/800x600/png?text=Nikon+D7500+Front', '11111111-0004-0004-0004-000000000004'),
('Nikon D7500 mặt sau', 'https://placehold.co/800x600/png?text=Nikon+D7500+Back', '11111111-0004-0004-0004-000000000004'),
-- prod 05 - Nikon D850
('Nikon D850 mặt trước', 'https://placehold.co/800x600/png?text=Nikon+D850+Front', '11111111-0005-0005-0005-000000000005'),
('Nikon D850 với lens 24-70', 'https://placehold.co/800x600/png?text=Nikon+D850+Lens', '11111111-0005-0005-0005-000000000005'),
-- prod 06 - Sony A7 IV
('Sony A7 IV mặt trước', 'https://placehold.co/800x600/png?text=Sony+A7IV+Front', '11111111-0006-0006-0006-000000000006'),
('Sony A7 IV mặt sau', 'https://placehold.co/800x600/png?text=Sony+A7IV+Back', '11111111-0006-0006-0006-000000000006'),
-- prod 07 - Sony ZV-E10
('Sony ZV-E10 màn hình lật', 'https://placehold.co/800x600/png?text=Sony+ZVE10+Screen', '11111111-0007-0007-0007-000000000007'),
('Sony ZV-E10 kèm kit lens', 'https://placehold.co/800x600/png?text=Sony+ZVE10+Kit', '11111111-0007-0007-0007-000000000007'),
-- prod 08 - Sony A1
('Sony A1 mặt trước', 'https://placehold.co/800x600/png?text=Sony+A1+Front', '11111111-0008-0008-0008-000000000008'),
('Sony A1 góc nghiêng', 'https://placehold.co/800x600/png?text=Sony+A1+Angle', '11111111-0008-0008-0008-000000000008'),
-- prod 09 - Fujifilm X-T5
('Fujifilm X-T5 mặt trước', 'https://placehold.co/800x600/png?text=Fujifilm+XT5+Front', '11111111-0009-0009-0009-000000000009'),
('Fujifilm X-T5 dial cơ học', 'https://placehold.co/800x600/png?text=Fujifilm+XT5+Dials', '11111111-0009-0009-0009-000000000009'),
-- prod 10 - Fujifilm X-S20
('Fujifilm X-S20 mặt trước', 'https://placehold.co/800x600/png?text=Fujifilm+XS20+Front', '11111111-0010-0010-0010-000000000010'),
('Fujifilm X-S20 màn hình 3 chiều', 'https://placehold.co/800x600/png?text=Fujifilm+XS20+Screen', '11111111-0010-0010-0010-000000000010'),
-- prod 11 - Canon RF 24-70 f/2.8
('Canon RF 24-70 f/2.8L mặt trước', 'https://placehold.co/800x600/png?text=Canon+RF+2470+Front', '11111111-0011-0011-0011-000000000011'),
('Canon RF 24-70 f/2.8L bokeh test', 'https://placehold.co/800x600/png?text=Canon+RF+2470+Bokeh', '11111111-0011-0011-0011-000000000011'),
-- prod 12 - Canon EF 50mm f/1.4
('Canon EF 50mm f/1.4 mặt trước', 'https://placehold.co/800x600/png?text=Canon+EF50+Front', '11111111-0012-0012-0012-000000000012'),
('Canon EF 50mm f/1.4 trên máy', 'https://placehold.co/800x600/png?text=Canon+EF50+OnCamera', '11111111-0012-0012-0012-000000000012'),
-- prod 13 - Sony FE 24-70 GM II
('Sony FE 24-70mm GM II mặt trước', 'https://placehold.co/800x600/png?text=Sony+FE2470+GM2+Front', '11111111-0013-0013-0013-000000000013'),
('Sony FE 24-70mm GM II chi tiết', 'https://placehold.co/800x600/png?text=Sony+FE2470+GM2+Detail', '11111111-0013-0013-0013-000000000013'),
-- prod 14 - Sigma 35mm f/1.4 Art
('Sigma 35mm f/1.4 Art mặt trước', 'https://placehold.co/800x600/png?text=Sigma+35+Art+Front', '11111111-0014-0014-0014-000000000014'),
('Sigma 35mm f/1.4 Art trên máy Sony', 'https://placehold.co/800x600/png?text=Sigma+35+Art+OnSony', '11111111-0014-0014-0014-000000000014'),
-- prod 15 - Tamron 28-75 G2
('Tamron 28-75mm G2 mặt trước', 'https://placehold.co/800x600/png?text=Tamron+2875+G2+Front', '11111111-0015-0015-0015-000000000015'),
('Tamron 28-75mm G2 trên máy', 'https://placehold.co/800x600/png?text=Tamron+2875+G2+OnCam', '11111111-0015-0015-0015-000000000015'),
-- prod 16 - Godox V860III
('Godox V860III mặt trước', 'https://placehold.co/800x600/png?text=Godox+V860III+Front', '11111111-0016-0016-0016-000000000016'),
('Godox V860III trên máy ảnh', 'https://placehold.co/800x600/png?text=Godox+V860III+OnCam', '11111111-0016-0016-0016-000000000016'),
-- prod 17 - Godox AD200Pro
('Godox AD200Pro với đầu bulb', 'https://placehold.co/800x600/png?text=Godox+AD200Pro+Bulb', '11111111-0017-0017-0017-000000000017'),
('Godox AD200Pro với đầu Fresnel', 'https://placehold.co/800x600/png?text=Godox+AD200Pro+Fresnel', '11111111-0017-0017-0017-000000000017'),
-- prod 18 - Godox SK400II Kit
('Bộ studio Godox SK400II đầy đủ', 'https://placehold.co/800x600/png?text=Godox+SK400II+Full', '11111111-0018-0018-0018-000000000018'),
('Đèn studio Godox SK400II đơn', 'https://placehold.co/800x600/png?text=Godox+SK400II+Single', '11111111-0018-0018-0018-000000000018'),
-- prod 19 - Lowepro ProTactic 450
('Balo Lowepro ProTactic 450 mặt trước', 'https://placehold.co/800x600/png?text=Lowepro+450+Front', '11111111-0019-0019-0019-000000000019'),
('Balo Lowepro ProTactic 450 mặt sau', 'https://placehold.co/800x600/png?text=Lowepro+450+Back', '11111111-0019-0019-0019-000000000019'),
-- prod 20 - Domke F-803
('Túi Domke F-803 mặt trước', 'https://placehold.co/800x600/png?text=Domke+F803+Front', '11111111-0020-0020-0020-000000000020'),
('Túi Domke F-803 bên trong', 'https://placehold.co/800x600/png?text=Domke+F803+Inside', '11111111-0020-0020-0020-000000000020'),
-- prod 21 - Pin Sony NP-FZ100
('Pin Sony NP-FZ100 chính hãng', 'https://placehold.co/800x600/png?text=Sony+NPFZ100+Front', '11111111-0021-0021-0021-000000000021'),
('Pin Sony NP-FZ100 hộp', 'https://placehold.co/800x600/png?text=Sony+NPFZ100+Box', '11111111-0021-0021-0021-000000000021'),
-- prod 22 - Sony CFexpress
('Thẻ nhớ Sony CFexpress 256GB', 'https://placehold.co/800x600/png?text=Sony+CFexpress+256', '11111111-0022-0022-0022-000000000022'),
('Thẻ nhớ Sony CFexpress TOUGH packaging', 'https://placehold.co/800x600/png?text=Sony+CFexpress+Pack', '11111111-0022-0022-0022-000000000022'),
-- prod 23 - Gitzo GT1545T
('Chân máy Gitzo GT1545T mở', 'https://placehold.co/800x600/png?text=Gitzo+GT1545T+Open', '11111111-0023-0023-0023-000000000023'),
('Chân máy Gitzo GT1545T gập', 'https://placehold.co/800x600/png?text=Gitzo+GT1545T+Folded', '11111111-0023-0023-0023-000000000023'),
-- prod 24 - DJI RS 3 Pro
('DJI RS 3 Pro mặt trước', 'https://placehold.co/800x600/png?text=DJI+RS3Pro+Front', '11111111-0024-0024-0024-000000000024'),
('DJI RS 3 Pro với máy ảnh', 'https://placehold.co/800x600/png?text=DJI+RS3Pro+WithCam', '11111111-0024-0024-0024-000000000024'),
-- prod 25 - K&F ND Variable
('Filter ND Variable K&F 77mm', 'https://placehold.co/800x600/png?text=KF+ND+Variable+77', '11111111-0025-0025-0025-000000000025'),
('Filter ND Variable K&F lắp lens', 'https://placehold.co/800x600/png?text=KF+ND+OnLens', '11111111-0025-0025-0025-000000000025'),
-- prod 26 - B+W CPL
('Filter CPL B+W MRC Nano 77mm', 'https://placehold.co/800x600/png?text=BW+CPL+77+Front', '11111111-0026-0026-0026-000000000026'),
('Filter CPL B+W lắp lens', 'https://placehold.co/800x600/png?text=BW+CPL+OnLens', '11111111-0026-0026-0026-000000000026'),
-- prod 27 - Leica M11
('Leica M11 mặt trước', 'https://placehold.co/800x600/png?text=Leica+M11+Front', '11111111-0027-0027-0027-000000000027'),
('Leica M11 mặt sau', 'https://placehold.co/800x600/png?text=Leica+M11+Back', '11111111-0027-0027-0027-000000000027'),
-- prod 28 - Olympus OM-1 Mark II
('Olympus OM-1 Mark II mặt trước', 'https://placehold.co/800x600/png?text=OM1MK2+Front', '11111111-0028-0028-0028-000000000028'),
('Olympus OM-1 Mark II ngoài trời', 'https://placehold.co/800x600/png?text=OM1MK2+Outdoor', '11111111-0028-0028-0028-000000000028'),
-- prod 29 - Sigma 18-50 f/2.8
('Sigma 18-50mm f/2.8 DC DN mặt trước', 'https://placehold.co/800x600/png?text=Sigma+1850+Front', '11111111-0029-0029-0029-000000000029'),
('Sigma 18-50mm f/2.8 DC DN trên ZV-E10', 'https://placehold.co/800x600/png?text=Sigma+1850+OnCam', '11111111-0029-0029-0029-000000000029'),
-- prod 30 - Panasonic S 50mm
('Panasonic Lumix S 50mm f/1.8 mặt trước', 'https://placehold.co/800x600/png?text=Pana+S50+Front', '11111111-0030-0030-0030-000000000030'),
('Panasonic Lumix S 50mm f/1.8 trên máy', 'https://placehold.co/800x600/png?text=Pana+S50+OnCam', '11111111-0030-0030-0030-000000000030');
-- ============================================================
-- 6. INVENTORY (30 bản ghi - 1 per product)
-- ============================================================
INSERT INTO public.inventory (on_hand, reserved, product_id) VALUES
(15, 2, '11111111-0001-0001-0001-000000000001'),
(25, 3, '11111111-0002-0002-0002-000000000002'),
(8,  1, '11111111-0003-0003-0003-000000000003'),
(20, 2, '11111111-0004-0004-0004-000000000004'),
(5,  1, '11111111-0005-0005-0005-000000000005'),
(18, 4, '11111111-0006-0006-0006-000000000006'),
(30, 5, '11111111-0007-0007-0007-000000000007'),
(3,  0, '11111111-0008-0008-0008-000000000008'),
(12, 2, '11111111-0009-0009-0009-000000000009'),
(22, 3, '11111111-0010-0010-0010-000000000010'),
(10, 1, '11111111-0011-0011-0011-000000000011'),
(40, 5, '11111111-0012-0012-0012-000000000012'),
(7,  2, '11111111-0013-0013-0013-000000000013'),
(35, 4, '11111111-0014-0014-0014-000000000014'),
(28, 3, '11111111-0015-0015-0015-000000000015'),
(50, 8, '11111111-0016-0016-0016-000000000016'),
(20, 2, '11111111-0017-0017-0017-000000000017'),
(6,  1, '11111111-0018-0018-0018-000000000018'),
(15, 2, '11111111-0019-0019-0019-000000000019'),
(30, 4, '11111111-0020-0020-0020-000000000020'),
(60, 10,'11111111-0021-0021-0021-000000000021'),
(45, 6, '11111111-0022-0022-0022-000000000022'),
(8,  1, '11111111-0023-0023-0023-000000000023'),
(10, 2, '11111111-0024-0024-0024-000000000024'),
(55, 7, '11111111-0025-0025-0025-000000000025'),
(70, 8, '11111111-0026-0026-0026-000000000026'),
(2,  0, '11111111-0027-0027-0027-000000000027'),
(9,  1, '11111111-0028-0028-0028-000000000028'),
(42, 5, '11111111-0029-0029-0029-000000000029'),
(38, 4, '11111111-0030-0030-0030-000000000030');

-- ============================================================
-- 7. DISCOUNTS (5 mã giảm giá)
-- discount_type: 'PERCENT' | 'FIXED_AMOUNT' | 'FREE_SHIP'
-- per_user_limit >= 1 (constraint)
-- ============================================================
INSERT INTO public.discounts (id, created_at, updated_at, active, code, discount_type, discount_value, end_at, max_usage, min_order_value, per_user_limit, start_at, used) VALUES
(
  '44444444-0001-0001-0001-000000000001',
  '2024-01-15 08:00:00+07', '2024-01-15 08:00:00+07',
  true, 'WELCOME10', 'PERCENT', 10.00,
  '2024-12-31 23:59:59+07', 500, 500000.00, 1,
  '2024-01-15 00:00:00+07', 45
),
(
  '44444444-0002-0002-0002-000000000002',
  '2024-02-01 08:00:00+07', '2024-02-01 08:00:00+07',
  true, 'TETHOLIDAY', 'FIXED_AMOUNT', 500000.00,
  '2024-02-25 23:59:59+07', 200, 5000000.00, 1,
  '2024-02-01 00:00:00+07', 120
),
(
  '44444444-0003-0003-0003-000000000003',
  '2024-03-01 08:00:00+07', '2024-03-01 08:00:00+07',
  true, 'FREESHIP2024', 'FREE_SHIP', 0.00,
  '2025-12-31 23:59:59+07', NULL, 2000000.00, 2,
  '2024-03-01 00:00:00+07', 88
),
(
  '44444444-0004-0004-0004-000000000004',
  '2024-04-01 08:00:00+07', '2024-04-01 08:00:00+07',
  true, 'CAMFAN15', 'PERCENT', 15.00,
  '2024-06-30 23:59:59+07', 100, 10000000.00, 1,
  '2024-04-01 00:00:00+07', 32
),
(
  '44444444-0005-0005-0005-000000000005',
  '2024-05-01 08:00:00+07', '2024-05-01 08:00:00+07',
  false, 'SUMMER2M', 'FIXED_AMOUNT', 2000000.00,
  '2024-05-31 23:59:59+07', 50, 20000000.00, 1,
  '2024-05-01 00:00:00+07', 50
);

-- ============================================================
-- 8. ADDRESSES (8 địa chỉ - mỗi user 1 địa chỉ)
-- ============================================================
INSERT INTO public.addresses (is_default, name, phone, province, street, ward, user_id) VALUES
(true,  'Nguyễn Quản Trị',  '0901000001', 'Hà Nội',           '12 Phố Huế, Quận Hai Bà Trưng',          'Phường Phố Huế',     'a1b2c3d4-0001-0001-0001-000000000001'),
(true,  'Trần Thị Hoa',     '0901000002', 'TP. Hồ Chí Minh',  '45 Nguyễn Thị Minh Khai, Quận 1',        'Phường Bến Nghé',    'a1b2c3d4-0002-0002-0002-000000000002'),
(true,  'Nguyễn Văn Minh',  '0912345601', 'Hà Nội',           '78 Trần Duy Hưng, Cầu Giấy',             'Phường Trung Hòa',   'a1b2c3d4-0003-0003-0003-000000000003'),
(true,  'Trần Thị Hương',   '0912345602', 'TP. Hồ Chí Minh',  '23 Đinh Tiên Hoàng, Bình Thạnh',         'Phường 1',           'a1b2c3d4-0004-0004-0004-000000000004'),
(true,  'Lê Văn Đức',       '0912345603', 'Đà Nẵng',          '56 Nguyễn Văn Linh, Thanh Khê',          'Phường Thanh Khê Đông','a1b2c3d4-0005-0005-0005-000000000005'),
(true,  'Phạm Thị Linh',    '0912345604', 'Hải Phòng',        '99 Lạch Tray, Ngô Quyền',                'Phường Đằng Giang',  'a1b2c3d4-0006-0006-0006-000000000006'),
(true,  'Võ Minh Tuấn',     '0912345605', 'Cần Thơ',          '34 Hòa Bình, Ninh Kiều',                 'Phường Tân An',      'a1b2c3d4-0007-0007-0007-000000000007'),
(true,  'Hoàng Thị An',     '0912345606', 'TP. Hồ Chí Minh',  '101 Bùi Thị Xuân, Quận 1',              'Phường Phạm Ngũ Lão','a1b2c3d4-0008-0008-0008-000000000008');

-- ============================================================
-- 9. ORDERS (10 đơn hàng)
-- status: PENDING | WAITING_FOR_DELIVERY | IN_TRANSIT | DELIVERED | CONFIRMED | CANCELLED
-- payment_status: UNPAID | PAID | FAILED | REFUNDED | PENDING | PROCESSING | PARTIAL_REFUND
-- shipping_address là JSONB
-- ============================================================
INSERT INTO public.orders (id, created_at, updated_at, cancelled_at, confirmed_at, discount_total, grand_total, has_paid, payment_status, shipping_address, shipping_fee, status, sub_total, discount_id, user_id) VALUES
(
  '22222222-0001-0001-0001-000000000001',
  '2024-03-10 10:00:00+07', '2024-03-12 14:00:00+07',
  NULL, '2024-03-12 14:00:00+07',
  0.00, 49330000.00, true, 'PAID',
  '{"name":"Nguyễn Văn Minh","phone":"0912345601","street":"78 Trần Duy Hưng, Cầu Giấy","ward":"Phường Trung Hòa","province":"Hà Nội"}'::jsonb,
  30000.00, 'CONFIRMED', 49300000.00,
  NULL,
  'a1b2c3d4-0003-0003-0003-000000000003'
),
(
  '22222222-0002-0002-0002-000000000002',
  '2024-03-15 11:00:00+07', '2024-03-15 11:30:00+07',
  NULL, NULL,
  500000.00, 31020000.00, false, 'UNPAID',
  '{"name":"Trần Thị Hương","phone":"0912345602","street":"23 Đinh Tiên Hoàng, Bình Thạnh","ward":"Phường 1","province":"TP. Hồ Chí Minh"}'::jsonb,
  30000.00, 'PENDING', 31490000.00,
  '44444444-0002-0002-0002-000000000002',
  'a1b2c3d4-0004-0004-0004-000000000004'
),
(
  '22222222-0003-0003-0003-000000000003',
  '2024-03-20 09:30:00+07', '2024-03-22 16:00:00+07',
  NULL, NULL,
  0.00, 48630000.00, true, 'PAID',
  '{"name":"Lê Văn Đức","phone":"0912345603","street":"56 Nguyễn Văn Linh, Thanh Khê","ward":"Phường Thanh Khê Đông","province":"Đà Nẵng"}'::jsonb,
  30000.00, 'IN_TRANSIT', 48600000.00,
  NULL,
  'a1b2c3d4-0005-0005-0005-000000000005'
),
(
  '22222222-0004-0004-0004-000000000004',
  '2024-04-01 08:00:00+07', '2024-04-05 10:00:00+07',
  NULL, '2024-04-05 10:00:00+07',
  4800000.00, 27020000.00, true, 'PAID',
  '{"name":"Phạm Thị Linh","phone":"0912345604","street":"99 Lạch Tray, Ngô Quyền","ward":"Phường Đằng Giang","province":"Hải Phòng"}'::jsonb,
  30000.00, 'CONFIRMED', 31790000.00,
  '44444444-0004-0004-0004-000000000004',
  'a1b2c3d4-0006-0006-0006-000000000006'
),
(
  '22222222-0005-0005-0005-000000000005',
  '2024-04-10 14:00:00+07', '2024-04-10 14:00:00+07',
  '2024-04-10 15:00:00+07', NULL,
  0.00, 30990000.00, false, 'UNPAID',
  '{"name":"Võ Minh Tuấn","phone":"0912345605","street":"34 Hòa Bình, Ninh Kiều","ward":"Phường Tân An","province":"Cần Thơ"}'::jsonb,
  30000.00, 'CANCELLED', 30960000.00,
  NULL,
  'a1b2c3d4-0007-0007-0007-000000000007'
),
(
  '22222222-0006-0006-0006-000000000006',
  '2024-04-15 09:00:00+07', '2024-04-20 11:00:00+07',
  NULL, '2024-04-20 11:00:00+07',
  0.00, 25330000.00, true, 'PAID',
  '{"name":"Nguyễn Văn Minh","phone":"0912345601","street":"78 Trần Duy Hưng, Cầu Giấy","ward":"Phường Trung Hòa","province":"Hà Nội"}'::jsonb,
  30000.00, 'DELIVERED', 25300000.00,
  NULL,
  'a1b2c3d4-0003-0003-0003-000000000003'
),
(
  '22222222-0007-0007-0007-000000000007',
  '2024-05-01 10:30:00+07', '2024-05-03 14:00:00+07',
  NULL, NULL,
  0.00, 13630000.00, true, 'PAID',
  '{"name":"Trần Thị Hương","phone":"0912345602","street":"23 Đinh Tiên Hoàng, Bình Thạnh","ward":"Phường 1","province":"TP. Hồ Chí Minh"}'::jsonb,
  30000.00, 'WAITING_FOR_DELIVERY', 13600000.00,
  NULL,
  'a1b2c3d4-0004-0004-0004-000000000004'
),
(
  '22222222-0008-0008-0008-000000000008',
  '2024-05-10 11:00:00+07', '2024-05-15 16:00:00+07',
  NULL, '2024-05-15 16:00:00+07',
  3099000.00, 27921000.00, true, 'PAID',
  '{"name":"Lê Văn Đức","phone":"0912345603","street":"56 Nguyễn Văn Linh, Thanh Khê","ward":"Phường Thanh Khê Đông","province":"Đà Nẵng"}'::jsonb,
  30000.00, 'CONFIRMED', 30990000.00,
  '44444444-0001-0001-0001-000000000001',
  'a1b2c3d4-0005-0005-0005-000000000005'
),
(
  '22222222-0009-0009-0009-000000000009',
  '2024-05-20 08:00:00+07', '2024-05-20 08:30:00+07',
  NULL, NULL,
  0.00, 24530000.00, false, 'PENDING',
  '{"name":"Phạm Thị Linh","phone":"0912345604","street":"99 Lạch Tray, Ngô Quyền","ward":"Phường Đằng Giang","province":"Hải Phòng"}'::jsonb,
  30000.00, 'PENDING', 24500000.00,
  NULL,
  'a1b2c3d4-0006-0006-0006-000000000006'
),
(
  '22222222-0010-0010-0010-000000000010',
  '2024-06-01 09:00:00+07', '2024-06-05 10:00:00+07',
  NULL, '2024-06-05 10:00:00+07',
  0.00, 5630000.00, true, 'PAID',
  '{"name":"Võ Minh Tuấn","phone":"0912345605","street":"34 Hòa Bình, Ninh Kiều","ward":"Phường Tân An","province":"Cần Thơ"}'::jsonb,
  30000.00, 'CONFIRMED', 5600000.00,
  NULL,
  'a1b2c3d4-0007-0007-0007-000000000007'
);

-- ============================================================
-- 10. ORDER_ITEMS (14 chi tiết - unique constraint order_id+product_id)
-- line_total = quantity * unit_price
-- ============================================================
INSERT INTO public.order_items (id, line_total, quantity, unit_price, order_id, product_id) 
OVERRIDING SYSTEM VALUE VALUES
(1, 48000000.00, 1, 48000000.00, '22222222-0001-0001-0001-000000000001', '11111111-0006-0006-0006-000000000006'),
(2, 7800000.00,  1, 7800000.00,  '22222222-0001-0001-0001-000000000001', '11111111-0014-0014-0014-000000000014'),
(3, 30990000.00, 1, 30990000.00, '22222222-0002-0002-0002-000000000002', '11111111-0001-0001-0001-000000000001'),
(4, 48000000.00, 1, 48000000.00, '22222222-0003-0003-0003-000000000003', '11111111-0006-0006-0006-000000000006'),
(5, 14500000.00, 1, 14500000.00, '22222222-0003-0003-0003-000000000003', '11111111-0015-0015-0015-000000000015'),
(6, 3800000.00,  2, 1900000.00,  '22222222-0003-0003-0003-000000000003', '11111111-0016-0016-0016-000000000016'),
(7, 43000000.00, 1, 43000000.00, '22222222-0004-0004-0004-000000000004', '11111111-0009-0009-0009-000000000009'),
(8, 30960000.00, 1, 30960000.00, '22222222-0005-0005-0005-000000000005', '11111111-0001-0001-0001-000000000001'),
(9, 18500000.00, 1, 18500000.00, '22222222-0006-0006-0006-000000000006', '11111111-0010-0010-0010-000000000010'),
(10, 3800000.00, 1, 3800000.00,  '22222222-0006-0006-0006-000000000006', '11111111-0016-0016-0016-000000000016'),
(11, 9500000.00, 1, 9500000.00,  '22222222-0007-0007-0007-000000000007', '11111111-0012-0012-0012-000000000012'),
(12, 850000.00,  1, 850000.00,   '22222222-0007-0007-0007-000000000007', '11111111-0026-0026-0026-000000000026'),
(13, 30990000.00, 1, 30990000.00, '22222222-0008-0008-0008-000000000008', '11111111-0001-0001-0001-000000000001'),
(14, 26500000.00, 1, 26500000.00, '22222222-0009-0009-0009-000000000009', '11111111-0004-0004-0004-000000000004'),
(15, 3800000.00, 1, 3800000.00, '22222222-0010-0010-0010-000000000010', '11111111-0016-0016-0016-000000000016'),
(16, 1300000.00, 1, 1300000.00, '22222222-0010-0010-0010-000000000010', '11111111-0025-0025-0025-000000000025');
-- ============================================================
-- 11. PAYMENTS (10 thanh toán - 1 per order, unique order_id)
-- method: COD | BANK_TRANSFER | E_WALLET
-- provider: MOMO | VNPAY | NONE
-- status: UNPAID | PAID | FAILED | REFUNDED | PENDING | PROCESSING | PARTIAL_REFUND
-- ============================================================
INSERT INTO public.payments (id, created_at, updated_at, amount, gateway_response, method, paid_at, provider, status, transaction_id, order_id) VALUES
(
  '33333333-0001-0001-0001-000000000001',
  '2024-03-10 10:05:00+07', '2024-03-10 10:10:00+07',
  49330000.00,
  '{"code":"00","message":"Thanh toan thanh cong","bank":"VCB","cardType":"ATM"}'::jsonb,
  'BANK_TRANSFER', '2024-03-10 10:10:00+07', 'VNPAY', 'PAID',
  'VNPAY20240310100001',
  '22222222-0001-0001-0001-000000000001'
),
(
  '33333333-0002-0002-0002-000000000002',
  '2024-03-15 11:05:00+07', '2024-03-15 11:05:00+07',
  31020000.00,
  NULL,
  'COD', NULL, 'NONE', 'UNPAID',
  NULL,
  '22222222-0002-0002-0002-000000000002'
),
(
  '33333333-0003-0003-0003-000000000003',
  '2024-03-20 09:35:00+07', '2024-03-20 09:40:00+07',
  48630000.00,
  '{"partnerCode":"MOMO","orderId":"22222222-0003-0003-0003-000000000003","transId":"3123456789","resultCode":0,"message":"Successful."}'::jsonb,
  'E_WALLET', '2024-03-20 09:40:00+07', 'MOMO', 'PAID',
  'MOMO3123456789',
  '22222222-0003-0003-0003-000000000003'
),
(
  '33333333-0004-0004-0004-000000000004',
  '2024-04-01 08:05:00+07', '2024-04-01 08:10:00+07',
  27020000.00,
  '{"code":"00","message":"Thanh toan thanh cong","bank":"TCB","cardType":"VISA"}'::jsonb,
  'BANK_TRANSFER', '2024-04-01 08:10:00+07', 'VNPAY', 'PAID',
  'VNPAY20240401080001',
  '22222222-0004-0004-0004-000000000004'
),
(
  '33333333-0005-0005-0005-000000000005',
  '2024-04-10 14:05:00+07', '2024-04-10 14:05:00+07',
  30990000.00,
  NULL,
  'COD', NULL, 'NONE', 'UNPAID',
  NULL,
  '22222222-0005-0005-0005-000000000005'
),
(
  '33333333-0006-0006-0006-000000000006',
  '2024-04-15 09:05:00+07', '2024-04-15 09:12:00+07',
  25330000.00,
  '{"partnerCode":"MOMO","orderId":"22222222-0006-0006-0006-000000000006","transId":"3987654321","resultCode":0,"message":"Successful."}'::jsonb,
  'E_WALLET', '2024-04-15 09:12:00+07', 'MOMO', 'PAID',
  'MOMO3987654321',
  '22222222-0006-0006-0006-000000000006'
),
(
  '33333333-0007-0007-0007-000000000007',
  '2024-05-01 10:35:00+07', '2024-05-01 10:42:00+07',
  13630000.00,
  '{"code":"00","message":"Thanh toan thanh cong","bank":"MB","cardType":"NAPAS"}'::jsonb,
  'BANK_TRANSFER', '2024-05-01 10:42:00+07', 'VNPAY', 'PAID',
  'VNPAY20240501100001',
  '22222222-0007-0007-0007-000000000007'
),
(
  '33333333-0008-0008-0008-000000000008',
  '2024-05-10 11:05:00+07', '2024-05-10 11:09:00+07',
  27921000.00,
  '{"partnerCode":"MOMO","orderId":"22222222-0008-0008-0008-000000000008","transId":"3111222333","resultCode":0,"message":"Successful."}'::jsonb,
  'E_WALLET', '2024-05-10 11:09:00+07', 'MOMO', 'PAID',
  'MOMO3111222333',
  '22222222-0008-0008-0008-000000000008'
),
(
  '33333333-0009-0009-0009-000000000009',
  '2024-05-20 08:05:00+07', '2024-05-20 08:05:00+07',
  24530000.00,
  NULL,
  'E_WALLET', NULL, 'MOMO', 'PENDING',
  NULL,
  '22222222-0009-0009-0009-000000000009'
),
(
  '33333333-0010-0010-0010-000000000010',
  '2024-06-01 09:05:00+07', '2024-06-01 09:08:00+07',
  5630000.00,
  '{"code":"00","message":"Thanh toan thanh cong","bank":"VCB","cardType":"NAPAS"}'::jsonb,
  'BANK_TRANSFER', '2024-06-01 09:08:00+07', 'VNPAY', 'PAID',
  'VNPAY20240601090001',
  '22222222-0010-0010-0010-000000000010'
);

-- ============================================================
-- 12. SHIPMENTS (10 vận chuyển - 1 per order, unique order_id)
-- status: PENDING | IN_TRANSIT | DELIVERED | RETURNED
-- ============================================================
INSERT INTO public.shipments (carrier, delivered_at, shipped_at, status, order_id) VALUES
('Giao Hàng Nhanh', '2024-03-12 14:00:00+07', '2024-03-11 08:00:00+07', 'DELIVERED',  '22222222-0001-0001-0001-000000000001'),
('Giao Hàng Tiết Kiệm', NULL,                  NULL,                     'PENDING',    '22222222-0002-0002-0002-000000000002'),
('Giao Hàng Nhanh', NULL,                       '2024-03-21 09:00:00+07', 'IN_TRANSIT', '22222222-0003-0003-0003-000000000003'),
('J&T Express',     '2024-04-05 10:00:00+07',   '2024-04-02 08:00:00+07', 'DELIVERED',  '22222222-0004-0004-0004-000000000004'),
('Giao Hàng Nhanh', NULL,                       NULL,                     'RETURNED',   '22222222-0005-0005-0005-000000000005'),
('GHTK',            '2024-04-20 11:00:00+07',   '2024-04-16 08:00:00+07', 'DELIVERED',  '22222222-0006-0006-0006-000000000006'),
('Giao Hàng Nhanh', NULL,                       '2024-05-02 09:00:00+07', 'IN_TRANSIT', '22222222-0007-0007-0007-000000000007'),
('J&T Express',     '2024-05-15 16:00:00+07',   '2024-05-12 08:00:00+07', 'DELIVERED',  '22222222-0008-0008-0008-000000000008'),
('Giao Hàng Tiết Kiệm', NULL,                   NULL,                     'PENDING',    '22222222-0009-0009-0009-000000000009'),
('GHTK',            '2024-06-05 10:00:00+07',   '2024-06-02 08:00:00+07', 'DELIVERED',  '22222222-0010-0010-0010-000000000010');
-- ============================================================
-- 13. REVIEWS (20 đánh giá)
-- Chỉ review được order_item đã DELIVERED/CONFIRMED
-- order_item_id phải UNIQUE (1 review per order_item)
-- rating: 1-5
-- status: PENDING | APPROVED | REJECTED
--
-- order_items IDs (generated by identity, sẽ là 1-16 theo thứ tự insert):
-- id=1:  order1 - Sony A7IV
-- id=2:  order1 - Sigma 35 Art
-- id=3:  order2 - Canon 90D
-- id=4:  order3 - Sony A7IV
-- id=5:  order3 - Tamron 28-75
-- id=6:  order3 - Godox V860III x2
-- id=7:  order4 - Fujifilm X-T5
-- id=8:  order5 - Canon 90D (cancelled)
-- id=9:  order6 - Fujifilm X-S20
-- id=10: order6 - Godox V860III
-- id=11: order7 - Canon EF 50mm
-- id=12: order7 - Filter CPL B+W
-- id=13: order8 - Canon 90D
-- id=14: order9 - Nikon D7500
-- id=15: order10 - Godox V860III
-- id=16: order10 - Filter ND Variable
-- Reviews chỉ cho order DELIVERED/CONFIRMED: orders 1,4,6,8,10
-- ============================================================
INSERT INTO public.reviews (comment, created_at, rating, status, order_item_id, product_id, user_id) VALUES
-- Order 1 items
('Sony A7 IV thực sự xuất sắc! AF cực nhanh, màu sắc đẹp tự nhiên.', '2024-03-14 10:00:00+07', 5, 'APPROVED', 1, '11111111-0006-0006-0006-000000000006', 'a1b2c3d4-0003-0003-0003-000000000003'),
('Sigma 35mm Art chụp đẹp, bokeh mướt. Giá tốt.', '2024-03-14 10:30:00+07', 5, 'APPROVED', 2, '11111111-0014-0014-0014-000000000014', 'a1b2c3d4-0003-0003-0003-000000000003'),

-- Order 4 items
('Fujifilm X-T5 màu film simulation đẹp mê hồn. IBIS hiệu quả.', '2024-04-07 09:00:00+07', 4, 'APPROVED', 7, '11111111-0009-0009-0009-000000000009', 'a1b2c3d4-0006-0006-0006-000000000006'),

-- Order 6 items
('Fujifilm X-S20 pin siêu bền, quay video ổn định.', '2024-04-22 11:00:00+07', 5, 'APPROVED', 9, '11111111-0010-0010-0010-000000000010', 'a1b2c3d4-0003-0003-0003-000000000003'),
('Godox V860III sạc nhanh, GN đủ mạnh.', '2024-04-22 11:30:00+07', 4, 'APPROVED', 10, '11111111-0016-0016-0016-000000000016', 'a1b2c3d4-0003-0003-0003-000000000003'),

-- Order 8 items
('Canon EOS 90D lần 2 mua vẫn thích. Màu rất đẹp tự nhiên.', '2024-05-17 10:00:00+07', 5, 'APPROVED', 13, '11111111-0001-0001-0001-000000000001', 'a1b2c3d4-0005-0005-0005-000000000005'),

-- Order 10 items
('Godox V860III dùng tốt, đủ sáng cho chụp outdoor.', '2024-06-07 10:00:00+07', 5, 'APPROVED', 15, '11111111-0016-0016-0016-000000000016', 'a1b2c3d4-0007-0007-0007-000000000007'),
('Filter ND Variable K&F chất lượng ổn cho giá tiền.', '2024-06-07 10:30:00+07', 4, 'APPROVED', 16, '11111111-0025-0025-0025-000000000025', 'a1b2c3d4-0007-0007-0007-000000000007'),

-- Đa dạng trạng thái
('Sony A7 IV chắc chắn nhưng menu hơi phức tạp.', '2024-03-25 14:00:00+07', 4, 'PENDING', 4, '11111111-0006-0006-0006-000000000006', 'a1b2c3d4-0005-0005-0005-000000000005'),
('Tamron 28-75 G2 zoom mượt, sharp từ f/2.8.', '2024-03-26 09:00:00+07', 5, 'APPROVED', 5, '11111111-0015-0015-0015-000000000015', 'a1b2c3d4-0005-0005-0005-000000000005'),
('Giao nhanh nhưng 1 cái lỗi, shop đã đổi mới.', '2024-03-27 10:00:00+07', 3, 'APPROVED', 6, '11111111-0016-0016-0016-000000000016', 'a1b2c3d4-0005-0005-0005-000000000005'),

-- User 4 / Order 7
('Canon EF 50mm cổ điển, bokeh lung linh.', '2024-05-05 10:00:00+07', 4, 'APPROVED', 11, '11111111-0012-0012-0012-000000000012', 'a1b2c3d4-0004-0004-0004-000000000004'),
('Filter CPL B+W chất lượng Đức tuyệt vời.', '2024-05-05 10:30:00+07', 5, 'APPROVED', 12, '11111111-0026-0026-0026-000000000026', 'a1b2c3d4-0004-0004-0004-000000000004'),

-- Rejected / Pending
('sản phẩm bình thường. không hài lòng lắm', '2024-04-08 08:00:00+07', 2, 'REJECTED', 3, '11111111-0001-0001-0001-000000000001', 'a1b2c3d4-0004-0004-0004-000000000004'),
('Nikon D7500 ổn, buffer lớn chụp liên tiếp tốt.', '2024-05-22 09:00:00+07', 4, 'PENDING', 14, '11111111-0004-0004-0004-000000000004', 'a1b2c3d4-0006-0006-0006-000000000006');

-- ============================================================
-- 14. SUPPORT_TICKETS (5 ticket hỗ trợ)
-- status: OPEN | IN_PROGRESS | RESOLVED | CLOSED
-- ============================================================
INSERT INTO public.support_tickets (id, content, created_at, status, subject, title, user_id) VALUES
(
  '55555555-0001-0001-0001-000000000001',
  'Mình đặt đơn hàng 22222222-0002-0002-0002-000000000002 từ 3 ngày trước nhưng chưa thấy shop xác nhận. Nhờ shop kiểm tra giúp mình với ạ. Mình đang chờ máy gấp để đi chụp sự kiện tuần sau.',
  '2024-03-18 10:00:00+07', 'RESOLVED',
  'Đơn hàng chưa được xác nhận',
  'Hỏi về tình trạng đơn hàng #22222222-0002',
  'a1b2c3d4-0004-0004-0004-000000000004'
),
(
  '55555555-0002-0002-0002-000000000002',
  'Máy Canon EOS 90D mình mua trong đơn 22222222-0001-0001-0001-000000000001 bị lỗi autofocus sau 2 tuần sử dụng. AF phase detection bị lạc nét liên tục dù đã calibrate. Nhờ shop hỗ trợ bảo hành giúp.',
  '2024-03-28 14:00:00+07', 'IN_PROGRESS',
  'Lỗi autofocus sau 2 tuần sử dụng',
  'Yêu cầu bảo hành Canon EOS 90D - Lỗi AF',
  'a1b2c3d4-0003-0003-0003-000000000003'
),
(
  '55555555-0003-0003-0003-000000000003',
  'Mình muốn hỏi sản phẩm Sony A1 có còn hàng không? Website hiện tại hiển thị còn 3 sản phẩm nhưng mình gọi điện không ai nghe máy. Nhờ shop xác nhận tình trạng hàng ạ.',
  '2024-04-05 09:00:00+07', 'CLOSED',
  'Hỏi tình trạng tồn kho Sony A1',
  'Kiểm tra hàng Sony A1 Body',
  'a1b2c3d4-0005-0005-0005-000000000005'
),
(
  '55555555-0004-0004-0004-000000000004',
  'Mình nhập mã giảm giá CAMFAN15 nhưng hệ thống báo không hợp lệ dù đơn hàng của mình đạt điều kiện tối thiểu 10 triệu. Nhờ shop kiểm tra và hỗ trợ áp dụng mã giùm.',
  '2024-04-12 11:00:00+07', 'RESOLVED',
  'Mã giảm giá không áp dụng được',
  'Lỗi mã giảm giá CAMFAN15 không hoạt động',
  'a1b2c3d4-0006-0006-0006-000000000006'
),
(
  '55555555-0005-0005-0005-000000000005',
  'Mình muốn đổi ống kính Sigma 35mm Art trong đơn 22222222-0001-0001-0001-000000000001 sang ống kính Sony FE 35mm f/1.4 GM. Đơn đã giao nhưng mình chưa mở hộp. Chính sách đổi hàng của shop như thế nào ạ?',
  '2024-05-05 15:00:00+07', 'OPEN',
  'Đổi sản phẩm sau khi nhận hàng',
  'Yêu cầu đổi ống kính Sigma 35mm sang Sony GM',
  'a1b2c3d4-0003-0003-0003-000000000003'
);

-- ============================================================
-- 15. WARRANTY_REQUESTS (3 yêu cầu bảo hành)
-- order_item_id phải tồn tại trong order_items
-- status: SUBMITTED | ACCEPTED | REJECTED | REPAIRED | REPLACED | RETURNED
-- Dùng order_item IDs từ đơn hàng đã CONFIRMED/DELIVERED
-- order_item 1 = Sony A7IV (order1), 7 = Fujifilm X-T5 (order4), 13 = Canon 90D (order8)
-- ============================================================
INSERT INTO public.warranty_requests (description, issue_type, requested_at, resolved_at, status, order_item_id) VALUES
(
  'Màn hình LCD xuất hiện các điểm chết (dead pixel) sau 1 tháng sử dụng bình thường. Đã kiểm tra firmware mới nhất nhưng vẫn bị. Nhờ kỹ thuật viên kiểm tra và thay thế nếu cần.',
  'Lỗi màn hình - Dead pixel',
  '2024-04-15 10:00:00+07',
  '2024-04-28 16:00:00+07',
  'REPAIRED',
  1
),
(
  'Cảm biến IBIS của Fujifilm X-T5 bị rung lắc bất thường khi bật chế độ IBIS. Ảnh bị nhòe dù tốc độ chụp cao. Đã thử reset về factory default nhưng không khắc phục được.',
  'Lỗi chống rung IBIS',
  '2024-04-20 14:00:00+07',
  NULL,
  'ACCEPTED',
  7
),
(
  'Canon EOS 90D bị lỗi mirror mechanism, mirror không hạ xuống đúng vị trí dẫn đến ảnh bị vignette nặng ở góc. Sự cố xuất hiện sau 3 tháng sử dụng khoảng 15.000 lần bấm máy.',
  'Lỗi cơ học - Mirror mechanism',
  '2024-05-25 09:00:00+07',
  NULL,
  'SUBMITTED',
  13
);

-- ============================================================
-- 16. ARTICLES (5 bài viết - admin_id phải là ADMIN user)
-- ============================================================
INSERT INTO public.articles (id, active, content, published_at, slug, summary, title, admin_id) VALUES
(
  '66666666-0001-0001-0001-000000000001',
  true,
  'Sony A7 IV vs Canon EOS R6 Mark II là cuộc đối đầu đáng chú ý nhất năm 2024 trong phân khúc mirrorless full frame tầm trung cao cấp. Cả hai đều sở hữu những điểm mạnh riêng biệt phù hợp với từng nhu cầu chụp ảnh khác nhau.

**Sony A7 IV** nổi bật với cảm biến BSI CMOS 33MP cho độ phân giải cao, hệ thống AF Real-time Tracking với 759 điểm phase detection bao phủ 94% khung hình, quay video 4K 60fps 10-bit. Đây là lựa chọn hoàn hảo cho nhiếp ảnh gia cần file ảnh chất lượng cao để in lớn hoặc crop nhiều.

**Canon EOS R6 Mark II** lại tập trung vào tốc độ với 40fps RAW liên tiếp, AF Subject Recognition thông minh nhận diện người, động vật, xe cộ, máy bay. Cảm biến 24.2MP đủ dùng cho hầu hết mục đích, xử lý tốt trong điều kiện ánh sáng yếu ISO cao.

Về video, Sony ưu thế hơn với 4K 60fps không crop từ full frame. Canon lại có màu sắc tự nhiên hơn và C-Log 3 dễ grade màu hơn trong post.

**Kết luận:** Nếu bạn ưu tiên ảnh tĩnh chất lượng cao và video chuyên nghiệp, chọn Sony A7 IV. Nếu bạn chụp thể thao, wildlife và cần tốc độ, Canon R6 Mark II là lựa chọn tốt hơn.',
  '2024-02-15 08:00:00+07',
  'so-sanh-sony-a7-iv-vs-canon-eos-r6-mark-ii-2024',
  'So sánh chi tiết Sony A7 IV và Canon EOS R6 Mark II về cảm biến, hệ thống AF, tốc độ chụp và khả năng quay video để giúp bạn đưa ra lựa chọn đúng đắn.',
  'So Sánh Sony A7 IV vs Canon EOS R6 Mark II: Đâu Là Lựa Chọn Tốt Hơn Năm 2024?',
  'a1b2c3d4-0001-0001-0001-000000000001'
),
(
  '66666666-0002-0002-0002-000000000002',
  true,
  'Chụp ảnh đường phố (street photography) là một trong những thể loại nhiếp ảnh đòi hỏi sự nhanh nhạy và khả năng hòa mình vào môi trường. Bài viết này chia sẻ 10 tips giúp bạn cải thiện kỹ năng chụp đường phố ngay lập tức.

**1. Sử dụng chế độ Zone Focusing**
Đặt trước tiêu cự và khẩu độ nhỏ (f/8-f/11) để toàn bộ cảnh trong phạm vi 2-10m đều nét. Bạn sẽ không cần đợi AF và bắt được khoảnh khắc nhanh hơn.

**2. Chụp từ hông thay vì áp mắt vào viewfinder**
Chụp ảnh "từ hông" (hip shooting) giúp bạn kín đáo hơn, chủ thể ít chú ý đến bạn hơn và bạn có thể góc chụp thú vị hơn.

**3. Tìm ánh sáng trước, chủ thể sau**
Hãy tìm một vùng ánh sáng đẹp rồi đứng chờ chủ thể bước vào. Đây là kỹ thuật "fishing" của nhiều nhiếp ảnh gia đường phố huyền thoại.

**4. Khai thác bóng đổ và phản chiếu**
Bóng đổ trên vỉa hè, phản chiếu từ mặt nước hay kính cửa hàng tạo ra những hình ảnh đầy tính nghệ thuật.

**5. Dùng lens góc rộng để gần chủ thể hơn**
Lens 28mm hay 35mm buộc bạn phải tiếp cận gần chủ thể hơn, tạo ra sự kết nối mạnh mẽ trong ảnh.

Áp dụng 5 tips đầu tiên này và bạn sẽ thấy sự khác biệt rõ rệt trong ảnh đường phố của mình ngay.',
  '2024-03-01 08:00:00+07',
  '10-tips-chup-anh-duong-pho-cho-nguoi-moi-bat-dau',
  '10 kỹ thuật và mẹo chụp ảnh đường phố thực tế giúp bạn cải thiện ngay từ những bức ảnh đầu tiên, từ zone focusing đến khai thác ánh sáng tự nhiên.',
  '10 Tips Chụp Ảnh Đường Phố Cho Người Mới Bắt Đầu',
  'a1b2c3d4-0001-0001-0001-000000000001'
),
(
  '66666666-0003-0003-0003-000000000003',
  true,
  'Fujifilm X-T5 là máy ảnh Mirrorless APS-C đáng mơ ước nhất năm 2023-2024 với cảm biến X-Trans CMOS 5 HR 40.2MP và thiết kế retro cổ điển. Sau 3 tháng sử dụng thực tế, đây là đánh giá chi tiết của chúng tôi.

**Thiết kế & Xây dựng**
X-T5 thừa hưởng ngôn ngữ thiết kế retro đặc trưng của Fujifilm với các dial cơ học cho ISO, tốc độ màn trập và bù sáng. Thân máy nhỏ gọn nhưng chắc chắn, chống thấm nước và bụi, cảm giác cầm tay tốt với grip sau được thiết kế lại.

**Chất lượng ảnh**
Cảm biến 40.2MP cho file ảnh chi tiết đến kinh ngạc. Ở ISO 400-3200 ảnh sạch hoàn toàn. ISO 6400 vẫn dùng được với chút noise reduction nhẹ. Film Simulation - đặc biệt là Velvia và Classic Chrome - cho màu sắc đẹp mê hồn mà không cần chỉnh sửa nhiều.

**Hiệu suất**
IBIS 7 stop thực sự hiệu quả, cho phép chụp tay cầm ở 1/15s với ống kính 50mm vẫn nét. Tốc độ AF Phase Detection nhanh và đáng tin cậy, tuy chưa bằng Sony hay Canon. Tốc độ chụp 15fps cơ học và 20fps electronic đủ cho hầu hết nhu cầu.

**Video**
Quay 6.2K RAW 30fps nội bộ là điểm cộng lớn. F-Log2 cho dynamic range rộng để grade màu. Tuy nhiên không có 4K 60fps từ sensor full-width là hạn chế đáng tiếc.

**Kết luận: 9/10**
X-T5 là máy ảnh hoàn hảo cho nhiếp ảnh gia yêu thích trải nghiệm cơ học và chất lượng ảnh tĩnh đỉnh cao. Nhược điểm duy nhất là video chưa toàn diện bằng Sony hay Canon.',
  '2024-03-20 08:00:00+07',
  'danh-gia-chi-tiet-fujifilm-x-t5-sau-3-thang-su-dung',
  'Đánh giá chi tiết Fujifilm X-T5 sau 3 tháng sử dụng thực tế: chất lượng ảnh 40MP, IBIS 7-stop, Film Simulation và khả năng quay video 6.2K.',
  'Đánh Giá Chi Tiết Fujifilm X-T5 Sau 3 Tháng Sử Dụng Thực Tế',
  'a1b2c3d4-0002-0002-0002-000000000002'
),
(
  '66666666-0004-0004-0004-000000000004',
  true,
  'Đèn flash ngoài trời (off-camera flash / portable strobe) đang ngày càng phổ biến trong nhiếp ảnh chân dung, cưới và thương mại. Godox AD200Pro và Godox V860III là hai lựa chọn hàng đầu ở phân khúc tầm trung. Bài viết này so sánh chi tiết hai sản phẩm để giúp bạn chọn đúng.

**Godox V860III - Flash on-camera versatile**
- Công suất: GN60 (ISO 100, 200mm)
- Pin: Li-ion 2000mAh - 650 lần nháy full power
- Thời gian sạc: 1.5 giây
- Kích thước: nhỏ gọn, dùng trên hotshoe hoặc off-camera
- Ưu điểm: Nhỏ nhẹ, pin bền, sạc nhanh, đa năng
- Nhược điểm: Công suất không đủ cho shoot ngoài trời nắng gắt

**Godox AD200Pro - Portable strobe 200W**
- Công suất: 200W - tương đương 2 x V860III
- Pin: Li-ion - 500 lần nháy full power
- Thời gian sạc: 0.01-2.1 giây
- 2 đầu flash: bulb (tròn) và Fresnel (fresnel lens)
- Ưu điểm: Công suất lớn, đầu flash đa dạng, HSS mạnh
- Nhược điểm: Nặng hơn, đắt hơn, cần bracket để gắn modifier

**Khi nào chọn V860III?**
Chụp sự kiện indoor, chân dung studio nhỏ, cần flash on-camera linh hoạt, budget eo hẹp.

**Khi nào chọn AD200Pro?**
Chụp cưới outdoor nắng, chân dung ngoài trời cần fill mạnh, muốn dùng softbox lớn, quay video cần đèn công suất cao.',
  '2024-04-10 08:00:00+07',
  'godox-ad200pro-vs-v860iii-nen-chon-den-flash-nao',
  'So sánh chi tiết Godox AD200Pro và V860III về công suất, thời lượng pin, tính năng và ứng dụng thực tế để giúp bạn chọn đèn flash phù hợp.',
  'Godox AD200Pro vs V860III: Nên Chọn Đèn Flash Nào Cho Nhu Cầu Của Bạn?',
  'a1b2c3d4-0001-0001-0001-000000000001'
),
(
  '66666666-0005-0005-0005-000000000005',
  true,
  'Hệ thống ống kính là khoản đầu tư dài hạn quan trọng hơn cả thân máy. Chọn đúng hệ sinh thái ngay từ đầu sẽ giúp bạn tiết kiệm chi phí đáng kể về sau. Bài viết này phân tích 4 hệ sinh thái ống kính phổ biến nhất hiện nay.

**Canon RF Mount**
Ngàm RF có đường kính 54mm và khoảng cách flange chỉ 20mm, cho phép thiết kế ống kính có optical performance vượt trội. Canon RF 24-70 f/2.8L IS USM, RF 85mm f/1.2L là những ví dụ điển hình.
- Ưu điểm: Optical quality đỉnh, IS tốt, tích hợp data transfer tốc độ cao
- Nhược điểm: Đắt, ít third-party lens

**Sony E Mount (FE cho Full Frame)**
Hệ sinh thái phong phú nhất với hàng trăm ống kính từ Sony, Sigma, Tamron, Zeiss. Sony FE G Master là chuẩn mực chất lượng cao.
- Ưu điểm: Nhiều lựa chọn, third-party tốt (Sigma Art, Tamron), autofocus xuất sắc
- Nhược điểm: Một số ống kính G Master giá cao

**Fujifilm X Mount (APS-C)**
Hệ sinh thái APS-C hoàn chỉnh với hơn 30 ống kính Fujinon đặc sắc. XF 56mm f/1.2 APD, XF 90mm f/2 là những gem thực sự.
- Ưu điểm: Nhỏ gọn, optical quality xuất sắc, màu sắc Fuji đặc trưng
- Nhược điểm: Không lên Full Frame được

**L-Mount Alliance (Leica, Panasonic, Sigma)**
Liên minh 3 hãng tạo ra hệ sinh thái ống kính dùng chung. Sigma DN Art series cho L-mount là lựa chọn cost-effective xuất sắc.
- Ưu điểm: Nhiều hãng cùng phát triển, Sigma Art giá tốt
- Nhược điểm: Hệ sinh thái còn đang phát triển

**Lời khuyên:** Hãy chọn hệ sinh thái dựa trên nhu cầu và thể loại chụp ảnh chính của bạn, không phải theo trào lưu.',
  '2024-05-01 08:00:00+07',
  'huong-dan-chon-he-sinh-thai-ong-kinh-phu-hop-2024',
  'Phân tích chi tiết 4 hệ sinh thái ống kính máy ảnh phổ biến: Canon RF, Sony E, Fujifilm X và L-Mount để giúp bạn đầu tư đúng ngay từ đầu.',
  'Hướng Dẫn Chọn Hệ Sinh Thái Ống Kính Phù Hợp Cho Bạn Năm 2024',
  'a1b2c3d4-0002-0002-0002-000000000002'
);

-- ============================================================
-- END OF SEED DATA
-- Tổng kết:
-- users: 8 | brands: 10 | categories: 8 | products: 30
-- media_assets: 60 | inventory: 30 | discounts: 5
-- addresses: 8 | orders: 10 | order_items: 16
-- payments: 10 | shipments: 10 | reviews: 14
-- support_tickets: 5 | warranty_requests: 3 | articles: 5
-- ============================================================
