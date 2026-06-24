/**
 * API SUCCESS RESPONSE
 *
 * Standardized success response builder.
 * Used by controllers to return consistent JSON responses.
 *
 * Properties:
 * - statusCode: HTTP status code (e.g., 200, 201)
 * - success: always true (indicates success)
 * - message: human-readable success description
 * - data: the actual response payload (user object, list, etc.)
 */
export class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.statusCode = statusCode;
    this.success = true;
    this.message = message;
    this.data = data;
  }
}
