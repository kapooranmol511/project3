import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function runMigration() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  console.log('Running migrations...');
  
  try {
    // First, generate the migrations if they don't exist
    console.log('Checking for migration files...');
    
    // Then run the migrations
    await migrate(db, { migrationsFolder: './drizzle' });
    
    console.log('Migrations completed successfully');
  } catch (err) {
    console.error('Migration failed', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration().catch((err) => {
  console.error('Migration failed', err);
  process.exit(1);
});
