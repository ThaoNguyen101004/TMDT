const { Client } = require('pg');

const client = new Client({
  user: 'postgres.ykgnutyoljducellogkm',
  password: 'Thaonguyen101004@',
  host: 'aws-1-ap-northeast-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

const emailsToUpdate = [
  'ngothaonguyenyl@gmail.com',
  'admin@lumierebeauty.vn',
  'ngothaonguyen10102004@gmail.com',
  'nguyennt10102004@gmail.com',
  'shinzuka1004@gmail.com'
];

const newHash = '$2b$10$r9gvAbEdtP1k5p6k/oYJIOizqXFV8VWdqkid4jjxRX8lu2iubdh6C'; // hash of Thaonguyen101004@

async function main() {
  await client.connect();
  
  for (const email of emailsToUpdate) {
    const res = await client.query(`
      UPDATE public.users 
      SET password_hash = $1, enabled = true, deleted_at = NULL, provider = 'local'
      WHERE email = $2
      RETURNING id, email, enabled, role, provider, deleted_at
    `, [newHash, email]);
    
    console.log(`Updated ${email}:`, res.rows);
  }
  
  await client.end();
}

main().catch(console.error);
