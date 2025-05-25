import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;
  public db: ReturnType<typeof drizzle>;
  private readonly logger = new Logger(DrizzleService.name);

  async onModuleInit() {
    try {
      // Parse the connection string or use individual parameters
      const dbUrl = process.env.DATABASE_URL;
      
      if (dbUrl) {
        // Using connection string
        this.logger.log('Connecting to database using connection string');
        this.pool = new Pool({
          connectionString: dbUrl,
          ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
        });
      } else {
        // Using individual parameters
        this.logger.log('Connecting to database using individual parameters');
        this.pool = new Pool({
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || '5432', 10),
          database: process.env.DB_NAME,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
        });
      }
      
      // Test the connection
      await this.pool.query('SELECT 1');
      this.logger.log('Successfully connected to the database');
      
      this.db = drizzle(this.pool, { schema });
    } catch (error) {
      this.logger.error(`Failed to connect to the database: ${error.message}`, error.stack);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.pool) {
      this.logger.log('Closing database connection');
      await this.pool.end();
    }
  }
}
