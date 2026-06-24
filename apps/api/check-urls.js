const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.sfpdetfcmqtnwvnyrdmv:kfV%23zRxiParDn%2F8@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres' });
async function run() {
  await client.connect();
  const res = await client.query('SELECT title, "thumbnailUrl" FROM courses');
  console.log(res.rows);
  await client.end();
}
run();
