// drizzle.config.js — Drizzle Kit configuration for schema migrations
// Points to schema files in src/schema and reads DATABASE_URL from .env
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // Schema files location — Drizzle Kit scans these to generate migrations
  schema: "./src/schema/*",
  // Output directory for generated migration SQL files
  out: "./drizzle",
  // Database dialect — we are using PostgreSQL (Supabase)
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
