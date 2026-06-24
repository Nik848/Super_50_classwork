import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { users } from "../schema/user.schema.js";
import { hashPassword } from "../utils/password.js";
import { ROLES } from "../constants/roles.js";

const CFO_NAME = "CFO Admin";
const CFO_EMAIL = "cfo@org.com";
const CFO_PASSWORD = "cfo123456";

const seedCFO = async () => {
  try {
    console.log("🌱 Starting CFO seed...");

    const [existingCFO] = await db
      .select()
      .from(users)
      .where(eq(users.email, CFO_EMAIL))
      .limit(1);

    if (existingCFO) {
      console.log("✅ CFO account already exists. Skipping seed.");
      process.exit(0);
    }

    const hashedPassword = await hashPassword(CFO_PASSWORD);

    const [cfoUser] = await db
      .insert(users)
      .values({
        name: CFO_NAME,
        email: CFO_EMAIL,
        passwordHash: hashedPassword, // Changed to passwordHash
        role: ROLES.CFO,
      })
      .returning();

    console.log("✅ CFO account created successfully!");
    console.log(`   Email: ${CFO_EMAIL}`);
    console.log(`   Role: ${cfoUser.role}`);
    console.log(`   ID: ${cfoUser.id}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to seed CFO:", error.message);
    process.exit(1);
  }
};

seedCFO();
