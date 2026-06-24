import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as userSchema from "../schema/user.schema.js";
import * as employeeManagerSchema from "../schema/employee-manager.schema.js";
import * as reimbursementSchema from "../schema/reimbursement.schema.js";

const client = postgres(process.env.DATABASE_URL);

export const db = drizzle(client, {
  schema: { ...userSchema, ...employeeManagerSchema, ...reimbursementSchema },
});
