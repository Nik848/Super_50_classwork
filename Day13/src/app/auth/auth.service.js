import { eq } from "drizzle-orm";
import { db } from "../../config/db.js";
import { users } from "../../schema/user.schema.js";
import { hashPassword, comparePassword } from "../../utils/password.js";
import { generateToken } from "../../utils/jwt.js";
import { ApiError } from "../../utils/ApiErrorResponse.js";
import { ROLES } from "../../constants/roles.js";

export const register = async ({ name, email, password }) => {
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser) {
    throw new ApiError(409, "Email already registered.");
  }

  const hashedPassword = await hashPassword(password);

  const [newUser] = await db
    .insert(users)
    .values({
      name,
      email,
      passwordHash: hashedPassword, // Changed from 'password' to 'passwordHash'
      role: ROLES.EMP, 
    })
    .returning();

  const { passwordHash: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const login = async ({ email, password }) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash); // Changed from 'password' to 'passwordHash'

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = generateToken({
    userId: user.id,
    role: user.role,
  });

  const { passwordHash: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};