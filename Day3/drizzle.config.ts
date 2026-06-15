import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load .env before reading DATABASE_URL
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in your .env file');
}

export default defineConfig({
  // Points to all schema files in the app directory
  schema: './src/app/products/products.schema.ts',

  // Migration files output directory
  out: './drizzle/migrations',

  // Database dialect
  dialect: 'postgresql',

  // Database connection credentials
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },

  // Verbose output during generation
  verbose: true,

  // Require explicit confirmation before executing destructive migrations
  strict: true,
});
