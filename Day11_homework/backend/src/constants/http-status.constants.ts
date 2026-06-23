/**
 * HTTP Status Codes
 *
 * Centralized constants to avoid magic numbers scattered across the codebase.
 * Using `as const` to get literal types (e.g., 200 instead of number).
 */
export const HTTP_STATUS = {
  // 2xx Success
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  // 4xx Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
