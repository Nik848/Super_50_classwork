import { pgTable, bigserial, bigint, varchar, text, decimal, timestamp, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./user.schema.js";

export const reimbursementStatus = pgTable("reimbursement_status", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  
  rmStatus: varchar("rm_status", { length: 20 })
    .notNull()
    .default("PENDING"),
    
  apeStatus: varchar("ape_status", { length: 20 })
    .notNull()
    .default("PENDING"),
    
  cfoStatus: varchar("cfo_status", { length: 20 })
    .notNull()
    .default("PENDING"),
    
  createdAt: timestamp("created_at").defaultNow(),
  
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
}, (table) => ({
  rmStatusCheck: check("rm_status_check", sql`${table.rmStatus} IN ('PENDING', 'APPROVED', 'REJECTED')`),
  apeStatusCheck: check("ape_status_check", sql`${table.apeStatus} IN ('PENDING', 'APPROVED', 'REJECTED')`),
  cfoStatusCheck: check("cfo_status_check", sql`${table.cfoStatus} IN ('PENDING', 'APPROVED', 'REJECTED')`),
}));


export const reimbursements = pgTable("reimbursements", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  
  employeeId: bigint("employee_id", { mode: "number" })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
    
  title: varchar("title", { length: 255 }).notNull(),
  
  description: text("description").notNull(),
  
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  
  statusId: bigint("status_id", { mode: "number" })
    .notNull()
    .unique()
    .references(() => reimbursementStatus.id, { onDelete: "cascade" }),
    
  createdAt: timestamp("created_at").defaultNow(),
  
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
}, (table) => ({
  amountCheck: check("amount_check", sql`${table.amount} > 0`),
}));
