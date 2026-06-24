/**
 * ROLE AUTHORIZATION MIDDLEWARE
 *
 * Example:
 * authorize(["CFO"])
 *
 * Allow access only if user role exists
 * in allowed roles array.
 */

/**
 * IMPLEMENTATION:
 * - Higher-order function: takes an array of allowed roles, returns middleware
 * - Checks req.user.role (set by authenticate middleware) against allowedRoles
 * - If user's role is in the allowed list → next()
 * - If not → returns 403 Forbidden
 *
 * Usage in routes:
 *   router.post("/assign", authenticate, authorize(["CFO"]), controller)
 *
 * IMPORTANT: authenticate middleware MUST run before authorize,
 * because authorize depends on req.user being set.
 */
import { ApiError } from "../utils/ApiErrorResponse.js";

export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // req.user is set by the authenticate middleware
      // If it's missing, authentication didn't run or failed
      if (!req.user) {
        throw new ApiError(401, "Not authenticated. Please login first.");
      }

      // Check if the user's role is in the list of allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        throw new ApiError(
          403,
          `Access denied. Required roles: ${allowedRoles.join(", ")}. Your role: ${req.user.role}.`
        );
      }

      // User has the required role — proceed to next middleware/controller
      next();
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          success: error.success,
          message: error.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: "Authorization check failed.",
      });
    }
  };
};