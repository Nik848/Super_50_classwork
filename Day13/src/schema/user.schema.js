import { pgTable, bigserial, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { VALID_ROLES } from "../constants/roles.js";

// Users table mapping to the provided SQL
export const users = pgTable("users", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  
  name: varchar("name", { length: 255 }).notNull(),
  
  email: varchar("email", { length: 255 }).unique().notNull(),
  
  passwordHash: text("password_hash").notNull(),
  
  role: varchar("role", { length: 10, enum: VALID_ROLES }).notNull(),
  
  createdAt: timestamp("created_at").defaultNow(),
  
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});