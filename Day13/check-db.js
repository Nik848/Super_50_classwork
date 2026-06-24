import "dotenv/config";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL);

try {
  const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`;
  console.log("Tables in public schema:", tables.map(t => t.table_name));
  
  // Check if users table exists and try to describe it
  const columns = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users' AND table_schema = 'public' ORDER BY ordinal_position`;
  console.log("Users table columns:", columns);
  
  await sql.end();
} catch (e) {
  console.error("Error:", e.message);
  await sql.end();
}
