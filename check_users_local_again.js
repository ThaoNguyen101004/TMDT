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
  const res = await client.query('SELECT id, email, password_hash, provider, role, enabled FROM public.users');
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
}

main().catch(console.error);
