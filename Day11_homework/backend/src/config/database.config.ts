import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from './env.config';
import { logger } from '../logger/logger';

/**
 * Database Configuration — Drizzle ORM + PostgreSQL (via pg Pool)
 *
 * WHAT IS A CONNECTION POOL:
 * Instead of creating a new DB connection for every request (expensive),
 * a pool maintains a set of reusable connections. Requests borrow a connection,
 * do their work, and return it to the pool.
 *
 * WHAT IS DRIZZLE ORM:
 * A TypeScript-first ORM that generates SQL from type-safe query builders.
 * Unlike Prisma (which uses a separate process), Drizzle compiles to raw SQL
 * at build time, making it extremely lightweight and fast.
 *
 * WHY DRIZZLE OVER PRISMA:
 * - Drizzle: SQL-like API, no code generation step, direct pg driver, smaller bundle
 * - Prisma: Higher abstraction, auto-migrations, larger ecosystem, more beginner-friendly
 * For production Node.js APIs, Drizzle is increasingly preferred for its performance.
 *
 * WHY node-postgres (pg):
 * The standard PostgreSQL driver for Node.js. Supabase's direct connection (port 5432)
 * is a standard PostgreSQL connection — pg is the correct choice here.
 */

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,                    // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,   // Close idle clients after 30 seconds
  connectionTimeoutMillis: 5000, // Fail fast if a connection takes > 5 seconds
});

// Log unexpected pool-level errors (e.g. network drops)
pool.on('error', (err: Error) => {
  logger.error('[Database] Unexpected PostgreSQL pool error', {
    message: err.message,
    stack: err.stack,
  });
});

// Initialize Drizzle with the pg Pool
export const db = drizzle(pool);

/**
 * connectDatabase — Validates the DB connection at startup.
 *
 * WHY: Fail fast. If the DATABASE_URL is wrong or Supabase is unreachable,
 * we want to know at startup — not when the first user hits an endpoint.
 */
export const connectDatabase = async (): Promise<void> => {
  let client;
  try {
    logger.info('[Database] Attempting to connect to PostgreSQL...');
    client = await pool.connect();
    logger.info('[Database] ✅ PostgreSQL connection established successfully');
  } catch (error) {
    logger.error('[Database] ❌ Failed to connect to PostgreSQL', { error });
    throw error; // Re-throw so server.ts can catch and exit
  } finally {
    // Always release the client back to the pool
    if (client) client.release();
  }
};
