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
  const res = await client.query(`
    SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
  `);
  console.log('Tables in public schema:', res.rows.map(r => r.table_name));
  
  // check columns of combos if it exists
  const hasCombos = res.rows.some(r => r.table_name === 'combos');
  if (hasCombos) {
    const columns = await client.query(`
      SELECT column_name, data_type FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'combos'
    `);
    console.log('Combos columns:', columns.rows);
    const data = await client.query('SELECT * FROM public.combos LIMIT 5');
    console.log('Combos data:', data.rows);
  }
  
  await client.end();
}

main().catch(console.error);
