import { z } from "zod";

export const assignEmployeeSchema = z
  .object({
    // Now numbers (BIGINT in DB)
    employeeId: z
      .number({ required_error: "employeeId is required", invalid_type_error: "employeeId must be a number" })
      .positive("employeeId must be positive"),

    managerId: z
      .number({ required_error: "managerId is required", invalid_type_error: "managerId must be a number" })
      .positive("managerId must be positive"),
  })
  .refine((data) => data.employeeId !== data.managerId, {
    message: "Employee cannot report to themselves.",
    path: ["managerId"], 
  });

export const validateAssignEmployee = (req, res, next) => {
  const result = assignEmployeeSchema.safeParse(req.body);
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