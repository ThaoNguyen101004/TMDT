const fs = require('fs');
const pg = require('pg');

const client = new pg.Client({
  host: 'aws-1-ap-northeast-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.ykgnutyoljducellogkm',
  password: 'Nguyen101004@2004',
  ssl: { rejectUnauthorized: false }
});

async function runSeed() {
  try {
    await client.connect();
    const sql = fs.readFileSync('c:\\webtmdt\\SecureShopCrash\\SecureShopCrash\\database\\seed_cosmetics.sql', 'utf8');
    await client.query(sql);
    console.log('✓ Seed data inserted successfully!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

runSeed();
