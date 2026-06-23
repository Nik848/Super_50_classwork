/*
  ORIGINAL COMMENT:
  dto to validate registeration request
  should have email and password

  IMPLEMENTATION:
  - Zod schema validates email (valid format) and password (min 6 chars)
  - validateRegistration middleware parses req.body and returns 400 on failure
*/
import { z } from "zod";

export const registrationSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Express middleware: validates req.body against the registration schema
export const validateRegistration = (req, res, next) => {
  const result = registrationSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.errors,
    });
  }
  // Replace req.body with parsed (sanitized) data
  req.body = result.data;
  next();
};