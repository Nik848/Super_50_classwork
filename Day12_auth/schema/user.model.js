/*
  ORIGINAL COMMENT:
  drizzle model for user table

  IMPLEMENTATION:
  - Users table with UUID primary key (generated server-side via crypto.randomUUID())
  - email: unique, not null
  - password: hashed, not null
  - created_at / updated_at: auto-managed timestamps
*/
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});