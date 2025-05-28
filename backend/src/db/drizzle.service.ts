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
      let dbName: string;
      
      // Create connection options for initial connection to postgres database
      let connectionOptions: any;
      
      if (dbUrl) {
        // Using connection string
        this.logger.log('Using database connection string');
        const url = new URL(dbUrl);
        dbName = url.pathname.substring(1); // Remove leading slash
        
        // Create a modified URL that connects to 'postgres' database instead
        const pgUrl = new URL(dbUrl);
        pgUrl.pathname = '/postgres';
        
        connectionOptions = {
          connectionString: pgUrl.toString(),
          ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
        };
      } else {
        // Using individual parameters
        this.logger.log('Using individual database parameters');
        dbName = process.env.DB_NAME || 'agentdbo';
        
        connectionOptions = {
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || '5432', 10),
          database: 'postgres', // Connect to default postgres database first
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD === undefined ? '' : process.env.DB_PASSWORD,
          ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
        };
      }
      
      // First connect to the postgres database
      const tempPool = new Pool(connectionOptions);
      
      try {
        // Check if our target database exists
        const result = await tempPool.query(
          "SELECT 1 FROM pg_database WHERE datname = $1",
          [dbName]
        );
        
        // If database doesn't exist, create it
        if (result.rows.length === 0) {
          this.logger.log(`Database '${dbName}' does not exist. Creating it now...`);
          // Need to use template0 to avoid encoding issues
          await tempPool.query(`CREATE DATABASE "${dbName}" TEMPLATE template0`);
          this.logger.log(`Database '${dbName}' created successfully`);
        }
      } finally {
        // Close the temporary connection
        await tempPool.end();
      }
      
      // Now connect to the actual database
      if (dbUrl) {
        this.pool = new Pool({
          connectionString: dbUrl,
          ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
        });
      } else {
        this.pool = new Pool({
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || '5432', 10),
          database: dbName,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD === undefined ? '' : process.env.DB_PASSWORD,
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
