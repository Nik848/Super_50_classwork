/**
 * LOGIN DTO
 *
 * Validate:
 * - email required
 * - password required
 */

/**
 * IMPLEMENTATION:
 * - Uses Zod for schema validation
 * - email: must be a valid email format
 * - password: must be a non-empty string
 * - validateLogin: Express middleware that parses req.body against this schema
 *   On success → replaces req.body with validated data and calls next()
 *   On failure → returns 400 with validation error details
 */
import { z } from "zod";

// Zod schema for login request body
export const loginSchema = z.object({
  // Email must be a valid email format
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),

  // Password must be provided (non-empty)
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

/**
 * Express middleware: validates req.body against the login schema
 * If valid → overwrites req.body with the cleaned/validated data and calls next()
 * If invalid → returns 400 with Zod validation errors
 */
export const validateLogin = (req, res, next) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.errors,
    });
  }
  // Replace req.body with validated data
  req.body = result.data;
  next();
};