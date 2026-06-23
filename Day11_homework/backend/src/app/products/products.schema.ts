import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  integer,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull().default(0),

  // DummyJSON specific rich fields
  thumbnail: text('thumbnail'),
  images: jsonb('images').$type<string[]>(),
  rating: numeric('rating', { precision: 3, scale: 2 }),
  discountPercentage: numeric('discount_percentage', { precision: 5, scale: 2 }),
  brand: varchar('brand', { length: 255 }),
  category: varchar('category', { length: 255 }),
  reviews: jsonb('reviews').$type<any[]>(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Inferred TypeScript types from the schema definition
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
