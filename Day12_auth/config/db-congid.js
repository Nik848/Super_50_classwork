/*
  ORIGINAL COMMENT:
  connect supabase using drizzle ORM

  IMPLEMENTATION:
  - Uses 'postgres' driver (postgres.js) to connect to Supabase
  - Wraps the connection with drizzle-orm for query building
  - Reads DATABASE_URL from .env via dotenv (loaded in app.js)
*/
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as userSchema from "../schema/user.model.js";
import * as productSchema from "../schema/product.model.js";

// Create the postgres.js connection client
const client = postgres(process.env.DATABASE_URL);

// Create the drizzle ORM instance with all schemas for relational queries
export const db = drizzle(client, {
  schema: { ...userSchema, ...productSchema },
});