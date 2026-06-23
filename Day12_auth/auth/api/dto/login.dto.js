/*
  ORIGINAL COMMENT:
  dto to validate login request
  should have email and password

  IMPLEMENTATION:
  - Zod schema validates email (valid format) and password (string, required)
  - validateLogin middleware parses req.body and returns 400 on failure
*/
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

// Express middleware: validates req.body against the login schema
export const validateLogin = (req, res, next) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.errors,
    });
  }
  req.body = result.data;
  next();
};