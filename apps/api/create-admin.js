const { Client } = require('pg');
const argon2 = require('argon2');

const client = new Client({ connectionString: 'postgresql://postgres.sfpdetfcmqtnwvnyrdmv:kfV%23zRxiParDn%2F8@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres' });

async function run() {
  await client.connect();
  
  try {
    const hashed = await argon2.hash('Najdawi123!');
    const email = 'admin@najdawi.com';
    
    // First try to delete it if it exists
    await client.query('DELETE FROM users WHERE email = $1', [email]);
    
    const query = `
      INSERT INTO users (id, email, password, "firstName", "lastName", role, "failedLoginAttempts", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), $1, $2, 'Super', 'Admin', 'admin', 0, NOW(), NOW())
      RETURNING email;
    `;
    const res = await client.query(query, [email, hashed]);
    console.log('Account created! Email:', res.rows[0].email);
  } catch(e) { 
    console.error('Error creating account:', e.message); 
  }
  
  await client.end();
}
run();
