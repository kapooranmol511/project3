import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  console.log('Running migrations...');
  
  await migrate(db, { migrationsFolder: 'drizzle' });
  
  console.log('Migrations completed successfully');
  
  await pool.end();
}

runMigration().catch((err) => {
  console.error('Migration failed', err);
  process.exit(1);
});
