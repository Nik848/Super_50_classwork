/**
 * ROLES CONTROLLER
 *
 * Responsibilities:
 * - Receive request
 * - Call service
 * - Return standardized response
 *
 * No business logic here.
 */

/**
 * IMPLEMENTATION:
 *
 * assignRole(req, res):
 * - Extracts validated body (userId, role) from req.body
 * - Passes currentUser (req.user) to the service for authorization checks
 * - Calls roles service assignRole
 * - Returns 200 OK with updated user data
 */
import * as rolesService from "./roles.service.js";
import { ApiResponse } from "../../utils/ApiSuccessResponse.js";

/**
 * Handle role assignment
 * POST /rest/roles/assign
 * Only CFO can access this route (enforced by middleware)
 */
export const assignRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    // Call the roles service — pass currentUser for self-assignment check
    const updatedUser = await rolesService.assignRole(
      { userId, role },
      req.user // The logged-in CFO (set by authenticate middleware)
    );

    // Return 200 OK with the updated user
    const response = new ApiResponse(200, "Role assigned successfully.", updatedUser);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Role assignment failed.",
    });
  }
};
