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
  
  // Set deleted_at = NULL for admin@lumierebeauty.vn
  const res = await client.query(`
    UPDATE public.users 
    SET deleted_at = NULL, enabled = true, role = 'ADMIN', provider = 'local' 
    WHERE email = 'admin@lumierebeauty.vn' 
    RETURNING id, email, enabled, role, provider, deleted_at
  `);
  
  console.log("Updated users:", res.rows);
  await client.end();
}

main().catch(console.error);
