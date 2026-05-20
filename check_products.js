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
  const res = await client.query('SELECT id, name, thumbnail_url FROM public.products LIMIT 5');
  console.log('Sample products:', res.rows);
  await client.end();
}

main().catch(console.error);
