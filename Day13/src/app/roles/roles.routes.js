/**
 * ROLE MANAGEMENT ROUTES
 *
 * POST /roles/assign
 *
 * CFO only.
 */

/**
 * IMPLEMENTATION:
 * - POST /assign → authenticate → authorize(["CFO"]) → validateAssignRole → assignRole controller
 *   Protected route — only CFO can assign roles to other users
 *   Middleware chain:
 *   1. authenticate: verifies JWT, loads req.user
 *   2. authorize(["CFO"]): ensures only CFO role can access
 *   3. validateAssignRole: validates request body (userId, role)
 *   4. assignRole controller: delegates to service and returns response
 *
 * These routes are mounted at /rest/roles in app.js
 */
import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validateAssignRole } from "./api/dto/assign-role.dto.js";
import { assignRole } from "./roles.controller.js";
import { ROLES } from "../../constants/roles.js";

const router = Router();

// POST /rest/roles/assign — Assign a role to a user (CFO only)
router.post(
  "/assign",
  authenticate, // Step 1: Verify JWT and load user
  authorize([ROLES.CFO]), // Step 2: Only CFO allowed
  validateAssignRole, // Step 3: Validate request body
  assignRole // Step 4: Handle the request
);

export default router;