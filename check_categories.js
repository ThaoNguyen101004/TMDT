const pg = require('pg');

const client = new pg.Client({
  host: 'aws-1-ap-northeast-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.ykgnutyoljducellogkm',
  password: 'Nguyen101004@2004',
  ssl: { rejectUnauthorized: false }
});

async function checkCategories() {
  try {
    await client.connect();
    const result = await client.query('SELECT id, name FROM public.categories ORDER BY id;');
    console.log('Total categories:', result.rows.length);
    result.rows.forEach(row => {
      console.log(`  ${row.id}. ${row.name}`);
    });
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

checkCategories();
