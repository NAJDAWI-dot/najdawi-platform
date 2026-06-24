import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load the root .env file
dotenv.config({ path: join(__dirname, '../../.env') });

const url = process.env.DATABASE_URL;
console.log('Testing connection to:', url?.split('@')[1]); // Safe logging

const AppDataSource = new DataSource({
  type: 'postgres',
  url: url,
  synchronize: true, // This will create the tables!
  entities: [join(__dirname, 'src/**/*.entity{.ts,.js}')],
});

AppDataSource.initialize()
  .then(() => {
    console.log('✅ Successfully connected to Supabase!');
    console.log('✅ Tables have been successfully synchronized.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error connecting to Supabase:', error);
    process.exit(1);
  });
