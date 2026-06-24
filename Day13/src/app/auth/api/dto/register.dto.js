/**
 * REGISTER DTO
 *
 * Validate:
 * - name required
 * - email required
 * - password required
 *
 * Only @org.com emails allowed.
 */

/**
 * IMPLEMENTATION:
 * - Uses Zod for schema validation
 * - name: string, trimmed, minimum 1 character
 * - email: must be a valid email AND end with "@org.com"
 * - password: string, minimum 6 characters for security
 * - validateRegister: Express middleware that parses req.body against this schema
 *   On success → replaces req.body with validated data and calls next()
 *   On failure → returns 400 with validation error details
 */
import { z } from "zod";

// Zod schema for registration request body
export const registerSchema = z.object({
  // Name must be a non-empty string
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, "Name cannot be empty"),

  // Email must be valid format AND end with @org.com (organizational email only)
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format")
    .refine((email) => email.endsWith("@org.com"), {
      message: "Only @org.com emails are allowed",
    }),

  // Password must be at least 6 characters
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

/**
 * Express middleware: validates req.body against the register schema
 * If valid → overwrites req.body with the cleaned/validated data and calls next()
 * If invalid → returns 400 with Zod validation errors
 */
export const validateRegister = (req, res, next) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.errors,
    });
  }
  // Replace req.body with validated & sanitized data
  req.body = result.data;
  next();
};