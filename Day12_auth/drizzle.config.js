// drizzle.config.js — Drizzle Kit configuration for schema migrations
// Points to schema files and reads DATABASE_URL from .env
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./schema/*",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
