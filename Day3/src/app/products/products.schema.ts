import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';

/**
 * Products Table Schema (Drizzle ORM)
 *
 * WHAT IS DRIZZLE SCHEMA:
 * The schema file defines the database table structure in TypeScript.
 * Drizzle uses this to:
 * 1. Generate type-safe query builders (db.select().from(products))
 * 2. Generate SQL migration files via drizzle-kit
 *
 * WHY UUID OVER AUTO-INCREMENT:
 * - UUIDs are unpredictable — prevents enumeration attacks (GET /products/1, /products/2...)
 * - Safe to generate client-side before inserting
 * - Works across distributed databases without coordination
 * - Industry standard for REST APIs (auto-increment IDs are fine for internal use)
 *
 * WHY numeric(10,2) FOR PRICE:
 * JavaScript's `number` type is IEEE 754 floating point — it cannot represent
 * all decimal values exactly (0.1 + 0.2 !== 0.3). PostgreSQL's NUMERIC type is
 * arbitrary-precision decimal. For money, ALWAYS use NUMERIC, never FLOAT.
 * Note: Drizzle returns NUMERIC as a string in JS to preserve precision.
 *
 * TYPE EXPORTS:
 * - `Product` → type of a row SELECTed from the table (all fields, correct types)
 * - `NewProduct` → type of a row INSERTed into the table (required vs optional fields)
 */
export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),

  name: varchar('name', { length: 255 }).notNull(),

  description: text('description'), // Nullable — product description is optional

  // Exact decimal precision for currency — NEVER use float/real for money
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),

  stock: integer('stock').notNull().default(0),

  createdAt: timestamp('created_at').notNull().defaultNow(),

  // Updated manually in the service layer on PATCH operations
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Inferred TypeScript types from the schema definition
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
