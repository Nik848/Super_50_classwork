/**
 * API ERROR RESPONSE
 *
 * Custom error class that extends the built-in Error.
 * Used throughout the application to throw consistent, structured errors.
 *
 * Properties:
 * - statusCode: HTTP status code (e.g., 400, 401, 403, 404, 500)
 * - success: always false (indicates failure)
 * - message: human-readable error description
 *
 * The global error handler in app.js catches these and sends a proper JSON response.
 */
export class ApiError extends Error {
  constructor(statusCode, message) {
    // Call parent Error constructor with the message
    super(message);

    this.statusCode = statusCode;
    this.success = false;

    // Capture the stack trace for debugging (excludes constructor call from trace)
    Error.captureStackTrace(this, this.constructor);
  }
}
