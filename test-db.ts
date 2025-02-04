import { config } from 'dotenv';
import postgres from 'postgres';

config({
  path: '.env.local',
});

async function testConnection() {
  const connectionString = process.env.POSTGRES_URL_NON_POOLING || 
    process.env.DATABASE_URL_UNPOOLED;

  if (!connectionString) {
    throw new Error('No unpooled database URL found');
  }

  console.log('⏳ Testing connection...');
  
  try {
    const sql = postgres(connectionString, {
      max: 1,
      connect_timeout: 30,
      idle_timeout: 30,
      ssl: { rejectUnauthorized: false } // Try this if SSL is causing issues
    });

    // Try a simple query
    const result = await sql`SELECT NOW();`;
    console.log('✅ Connected successfully!');
    console.log('Current database time:', result[0].now);
    
    await sql.end();
  } catch (error) {
    console.error('❌ Connection failed');
    console.error(error);
  }
}

testConnection(); 