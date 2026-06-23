/*
  ORIGINAL COMMENT:
  drizzle -pg
  products:
      id
      name
      price
      stock
      images
      user_id foreign key from users table
      created at
      updated at

  IMPLEMENTATION:
  - Products table with UUID primary key
  - name, price, stock, images (text array)
  - user_id foreign key referencing users.id with cascade delete
  - created_at / updated_at timestamps
*/
import {
  pgTable,
  text,
  numeric,
  integer,
  uuid,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./user.model.js";

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull().default(0),
  images: text("images").array(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
