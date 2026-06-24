/**
 * EMPLOYEE ROUTES
 *
 * GET /employees
 * POST /employees/assign
 * DELETE /employees/assign
 */

/**
 * IMPLEMENTATION:
 *
 * GET / → authenticate → authorize(["RM","APE","CFO"]) → getEmployees controller
 *   RM sees own employees, APE sees EMP+RM, CFO sees everyone
 *   EMP cannot access this endpoint
 *
 * POST /assign → authenticate → authorize(["CFO"]) → validateAssignEmployee → assignEmployee controller
 *   Only CFO can assign an EMP to an RM
 *
 * DELETE /assign → authenticate → authorize(["CFO"]) → validateAssignEmployee → removeAssignment controller
 *   Only CFO can remove an EMP from an RM
 *
 * These routes are mounted at /rest/employees in app.js
 */
import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validateAssignEmployee } from "./api/dto/assign-employee.dto.js";
import {
  getEmployees,
  assignEmployee,
  removeAssignment,
} from "./employees.controller.js";
import { ROLES } from "../../constants/roles.js";

const router = Router();

// GET /rest/employees — List employees based on role visibility
router.get(
  "/",
  authenticate, // Step 1: Verify JWT and load user
  authorize([ROLES.RM, ROLES.APE, ROLES.CFO]), // Step 2: EMP cannot view employee list
  getEmployees // Step 3: Handle the request
);

// POST /rest/employees/assign — Assign an EMP to an RM (CFO only)
router.post(
  "/assign",
  authenticate, // Step 1: Verify JWT and load user
  authorize([ROLES.CFO]), // Step 2: Only CFO allowed
  validateAssignEmployee, // Step 3: Validate request body
  assignEmployee // Step 4: Handle the request
);

// DELETE /rest/employees/assign — Remove an EMP from an RM (CFO only)
router.delete(
  "/assign",
  authenticate, // Step 1: Verify JWT and load user
  authorize([ROLES.CFO]), // Step 2: Only CFO allowed
  validateAssignEmployee, // Step 3: Validate request body
  removeAssignment // Step 4: Handle the request
);

export default router;