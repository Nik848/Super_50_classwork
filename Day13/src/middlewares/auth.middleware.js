/**
 * AUTHENTICATION MIDDLEWARE
 *
 * Responsibilities:
 * - Read JWT cookie
 * - Verify token
 * - Load user
 * - Attach req.user
 */

/**
 * IMPLEMENTATION:
 * - Reads the "token" cookie from the request (set during login)
 * - Verifies the JWT using verifyToken utility
 * - Queries the database to find the user by the decoded userId
 * - Attaches the user object (without password) to req.user
 * - If no token, invalid token, or user not found → returns 401 Unauthorized
 * - This middleware must run BEFORE any protected route
 */
import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { users } from "../schema/user.schema.js";
import { verifyToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiErrorResponse.js";

export const authenticate = async (req, res, next) => {
  try {
    // Step 1: Read the JWT token from HTTP-only cookie
    const token = req.cookies?.token;

    // If no token cookie exists, user is not logged in
    if (!token) {
      throw new ApiError(401, "Not authenticated. Please login.");
    }

    // Step 2: Verify the token and extract payload (userId, role)
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      // Token is expired or tampered with
      throw new ApiError(401, "Invalid or expired token. Please login again.");
    }

    // Step 3: Query the database to find the user by the decoded userId
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1);

    // If user was deleted after the token was issued
    if (!user) {
      throw new ApiError(401, "User not found. Please login again.");
    }

    // Step 4: Attach user to request object (exclude password for security)
    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If it's our custom ApiError, send it as JSON
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: error.success,
        message: error.message,
      });
    }
    // For unexpected errors, send 500
    return res.status(500).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};