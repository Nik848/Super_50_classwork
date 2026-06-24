import { z } from "zod";
import { VALID_ROLES } from "../../../../constants/roles.js";

export const assignRoleSchema = z.object({
  // Target user ID — now a number (BIGINT in DB)
  userId: z
    .number({ required_error: "userId is required", invalid_type_error: "userId must be a number" })
    .positive("userId must be positive"),

  role: z.enum(VALID_ROLES, {
    required_error: "role is required",
    invalid_type_error: `role must be one of: ${VALID_ROLES.join(", ")}`,
  }),
});

export const validateAssignRole = (req, res, next) => {
  const result = assignRoleSchema.safeParse(req.body);
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