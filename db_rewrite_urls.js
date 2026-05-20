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
  
  // Find all columns in public schema that might contain strings
  const res = await client.query(`
    SELECT table_name, column_name 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND data_type IN ('character varying', 'text')
  `);
  
  for (const row of res.rows) {
    const { table_name, column_name } = row;
    try {
      // Check if any row has 'tmdt-gd1m'
      const countRes = await client.query(`
        SELECT COUNT(*) FROM public."${table_name}"
        WHERE "${column_name}" LIKE '%tmdt-gd1m%'
      `);
      const count = parseInt(countRes.rows[0].count, 10);
      if (count > 0) {
        console.log(`Found ${count} rows in ${table_name}.${column_name} containing 'tmdt-gd1m'`);
        
        // Update them
        const updateRes = await client.query(`
          UPDATE public."${table_name}"
          SET "${column_name}" = REPLACE("${column_name}", 'https://tmdt-gd1m.onrender.com', 'http://localhost:12345')
          WHERE "${column_name}" LIKE '%tmdt-gd1m%'
          RETURNING "${column_name}" LIMIT 2
        `);
        console.log(`Updated ${table_name}.${column_name}. Sample:`, updateRes.rows);
      }
    } catch (e) {
      // Ignore tables we can't query or edit
      // console.error(`Error querying ${table_name}.${column_name}:`, e.message);
    }
  }
  
  await client.end();
}

main().catch(console.error);
