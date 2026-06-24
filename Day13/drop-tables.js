import "dotenv/config";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL);

try {
  console.log("Dropping tables...");
  await sql`DROP TABLE IF EXISTS "reimbursements" CASCADE`;
  await sql`DROP TABLE IF EXISTS "reimbursement_status" CASCADE`;
  await sql`DROP TABLE IF EXISTS "employee_manager_mapping" CASCADE`;
  await sql`DROP TABLE IF EXISTS "rbac_users" CASCADE`;
  await sql`DROP TABLE IF EXISTS "users" CASCADE`;
  await sql`DROP TABLE IF EXISTS "__drizzle_migrations" CASCADE`;
  console.log("Tables dropped successfully.");
  await sql.end();
} catch (e) {
  console.error("Error:", e.message);
  await sql.end();
}
