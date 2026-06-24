const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.sfpdetfcmqtnwvnyrdmv:kfV%23zRxiParDn%2F8@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres' });
async function run() {
  await client.connect();
  console.log('Connected to DB');
  
  try {
    await client.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "failedLoginAttempts" integer NOT NULL DEFAULT 0');
    await client.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "lockedUntil" timestamp without time zone');
    console.log('1. Added missing columns');
  } catch(e) { console.error('Error 1:', e.message); }

  try {
    await client.query('ALTER TYPE enrollments_status_enum ADD VALUE IF NOT EXISTS \'pending\'');
    console.log('2. Added pending enum');
  } catch(e) { console.error('Error 2:', e.message); }

  try {
    const res = await client.query('UPDATE "courses" SET "thumbnailUrl" = REPLACE("thumbnailUrl", \'http://localhost:3000\', \'https://najdawi-platform.onrender.com\') WHERE "thumbnailUrl" LIKE \'http://localhost:3000%\'');
    console.log('3. Updated image URLs, rows affected:', res.rowCount);
  } catch(e) { console.error('Error 3:', e.message); }
  
  await client.end();
}
run();
