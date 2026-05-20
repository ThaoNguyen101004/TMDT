const { Client } = require('pg');

const client = new Client({
  user: 'postgres.ykgnutyoljducellogkm',
  password: 'Thaonguyen101004@',
  host: 'aws-1-ap-northeast-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();
  
  console.log('Checking current products in DB containing tmdt-gd1m...');
  const checkRes = await client.query(`
    SELECT COUNT(*) FROM public.products WHERE thumbnail_url LIKE '%tmdt-gd1m%'
  `);
  console.log('Count before update:', checkRes.rows[0].count);
  
  if (parseInt(checkRes.rows[0].count, 10) > 0) {
    try {
      const updateRes = await client.query(`
        UPDATE public.products
        SET thumbnail_url = REPLACE(thumbnail_url, 'https://tmdt-gd1m.onrender.com', 'http://localhost:12345')
        WHERE thumbnail_url LIKE '%tmdt-gd1m%'
        RETURNING id, name, thumbnail_url
      `);
      console.log(`✓ Successfully updated ${updateRes.rowCount} products.`);
      console.log('Sample updated products:', updateRes.rows.slice(0, 3));
    } catch (err) {
      console.error('Error updating products:', err.message);
    }
  } else {
    console.log('No products found with tmdt-gd1m.');
  }

  console.log('Checking categories in DB...');
  const catRes = await client.query(`
    SELECT COUNT(*) FROM public.categories WHERE image_url LIKE '%tmdt-gd1m%'
  `);
  console.log('Categories count:', catRes.rows[0].count);
  if (parseInt(catRes.rows[0].count, 10) > 0) {
    try {
      const catUpdate = await client.query(`
        UPDATE public.categories
        SET image_url = REPLACE(image_url, 'https://tmdt-gd1m.onrender.com', 'http://localhost:12345')
        WHERE image_url LIKE '%tmdt-gd1m%'
        RETURNING id, name, image_url
      `);
      console.log(`✓ Successfully updated ${catUpdate.rowCount} categories.`);
    } catch (err) {
      console.error('Error updating categories:', err.message);
    }
  }

  await client.end();
}

main().catch(console.error);
