const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nqbipsmlwiujvalpseoe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xYmlwc21sd2l1andrYWxwc2VvZSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzMxNzU5MDAwLCJleHAiOjE4ODk1MjUwMDB9.123456789ABCDEFG';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedData() {
  try {
    console.log('🌱 Starting database seed...');

    // 1. Insert brands
    console.log('📦 Inserting brands...');
    const brands = [
      { name: 'Dior' },
      { name: 'Chanel' },
      { name: 'MAC' },
      { name: 'Estée Lauder' },
      { name: 'Shiseido' },
      { name: 'Lancôme' },
      { name: 'Maybelline' },
      { name: 'L\'Oréal' }
    ];
    
    const { data: brandsData, error: brandsError } = await supabase
      .from('brands')
      .insert(brands)
      .select();
    
    if (brandsError) console.error('Brand error:', brandsError);
    else console.log(`✓ Inserted ${brandsData?.length || 0} brands`);

    // 2. Insert categories
    console.log('📂 Inserting categories...');
    const categories = [
      { name: 'Trang Điểm', description: 'Sản phẩm trang điểm và màu sắc', active: true },
      { name: 'Skincare', description: 'Chăm sóc và dưỡng da', active: true },
      { name: 'Nước Hoa', description: 'Nước hoa và mùi hương', active: true },
      { name: 'Body Care', description: 'Chăm sóc tóc và cơ thể', active: true },
      { name: 'Tools & Accessories', description: 'Công cụ và phụ kiện', active: true }
    ];
    
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .insert(categories)
      .select();
    
    if (categoriesError) console.error('Category error:', categoriesError);
    else console.log(`✓ Inserted ${categoriesData?.length || 0} categories`);

    // 3. Insert products
    console.log('🛍️ Inserting products...');
    const products = [
      { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Dior Addict Lipstick', sku: 'DIOR-ADDICT-001', price: 790000, listed_price: 890000, brand_id: 1, category_id: 1, active: true, rating: 4.8, review_count: 145, short_desc: 'Son môi cao cấp từ Dior', long_desc: 'Son môi bền màu 24h với độ mềm mượt hoàn hảo', thumbnail_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500' },
      { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Chanel Eyeshadow Palette', sku: 'CHANEL-SHADOW-001', price: 580000, listed_price: 650000, brand_id: 2, category_id: 1, active: true, rating: 4.9, review_count: 203, short_desc: 'Bộ phấn mắt Chanel cao cấp', long_desc: 'Phấn mắt 16 màu với công thức lâu trôi' },
      { id: '550e8400-e29b-41d4-a716-446655440003', name: 'MAC Fix+', sku: 'MAC-FIX-001', price: 390000, listed_price: 450000, brand_id: 3, category_id: 1, active: true, rating: 4.7, review_count: 98, short_desc: 'Xịt cố định trang điểm', long_desc: 'Lót mắt bền màu, không nổi mụn' },
      { id: '550e8400-e29b-41d4-a716-446655440004', name: 'Estée Lauder Eye Cream', sku: 'ESTEE-EYE-001', price: 1050000, listed_price: 1200000, brand_id: 4, category_id: 2, active: true, rating: 4.9, review_count: 287, short_desc: 'Kem mắt chống lão hóa cao cấp', long_desc: 'Kem dưỡng da vùng mắt chống lão hóa' },
      { id: '550e8400-e29b-41d4-a716-446655440005', name: 'Shiseido Vital-Perfection', sku: 'SHISEIDO-VIT-C-001', price: 850000, listed_price: 950000, brand_id: 5, category_id: 2, active: true, rating: 4.8, review_count: 156, short_desc: 'Serum vitamin C từ Shiseido', long_desc: 'Serum vitamin C làm sáng da, giảm thâm' },
      { id: '550e8400-e29b-41d4-a716-446655440006', name: 'Lancôme Tonique Confort', sku: 'LANCOME-TONER-001', price: 680000, listed_price: 750000, brand_id: 6, category_id: 2, active: true, rating: 4.7, review_count: 134, short_desc: 'Toner dưỡng ẩm Lancôme', long_desc: 'Nước toner cân bằng độ ẩm cho da' },
      { id: '550e8400-e29b-41d4-a716-446655440007', name: 'Dior Prestige Night', sku: 'DIOR-NIGHT-001', price: 750000, listed_price: 850000, brand_id: 1, category_id: 2, active: true, rating: 4.8, review_count: 189, short_desc: 'Kem đêm cao cấp từ Dior', long_desc: 'Kem dưỡng ban đêm phục hồi da tổn thương' },
      { id: '550e8400-e29b-41d4-a716-446655440008', name: 'Chanel No.5', sku: 'CHANEL-NO5-100ML', price: 2200000, listed_price: 2500000, brand_id: 2, category_id: 3, active: true, rating: 5.0, review_count: 412, short_desc: 'Nước hoa nữ huyền thoại từ Chanel', long_desc: 'Nước hoa nữ hương thơm lâu 12h, tone hoa đơn' },
      { id: '550e8400-e29b-41d4-a716-446655440009', name: 'Dior Miss Dior', sku: 'DIOR-MISS-100ML', price: 1600000, listed_price: 1800000, brand_id: 1, category_id: 3, active: true, rating: 4.9, review_count: 356, short_desc: 'Nước hoa nữ tính từ Dior', long_desc: 'Nước hoa nữ mùi hoa cây gỗ, lưu hương 10h' },
      { id: '550e8400-e29b-41d4-a716-446655440010', name: 'Lancôme La Vie Est Belle', sku: 'LANCOME-LAVIE-100ML', price: 1350000, listed_price: 1500000, brand_id: 6, category_id: 3, active: true, rating: 4.8, review_count: 298, short_desc: 'Nước hoa nữ tươi sáng Lancôme', long_desc: 'Nước hoa nữ mùi cam ngọt, lưu hương 8h' }
    ];

    // Insert products without timestamps (backend will add them)
    const productsToInsert = products.map(p => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      price: p.price,
      listed_price: p.listed_price,
      brand_id: p.brand_id,
      category_id: p.category_id,
      active: p.active,
      rating: p.rating,
      review_count: p.review_count,
      short_desc: p.short_desc,
      long_desc: p.long_desc,
      thumbnail_url: p.thumbnail_url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500'
    }));

    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .insert(productsToInsert)
      .select();
    
    if (productsError) console.error('Products error:', productsError);
    else console.log(`✓ Inserted ${productsData?.length || 0} products`);

    // 4. Insert inventory
    console.log('📊 Inserting inventory...');
    const inventory = products.map(p => ({
      product_id: p.id,
      quantity_available: Math.floor(Math.random() * 200) + 30,
      quantity_reserved: Math.floor(Math.random() * 10),
      quantity_damaged: 0
    }));

    const { data: inventoryData, error: inventoryError } = await supabase
      .from('inventory')
      .insert(inventory)
      .select();
    
    if (inventoryError) console.error('Inventory error:', inventoryError);
    else console.log(`✓ Inserted ${inventoryData?.length || 0} inventory records`);

    console.log('✅ Database seed completed successfully!');

  } catch (error) {
    console.error('❌ Seed error:', error.message);
  }
}

seedData();
