import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors/app-error';
import { APIErrorResponse } from '../utils/api-response';
import { HTTP_STATUS } from '../constants/http-status.constants';
import { logger } from '../logger/logger';

/**
 * Global Error Handler Middleware
 *
 * WHAT IT IS:
 * Express recognizes a 4-argument middleware (err, req, res, next) as an error handler.
 * It must be registered LAST in app.ts after all routes.
 *
 * WHY CENTRALIZED ERROR HANDLING:
 * - No try/catch in controllers — asyncHandler + next(err) handles forwarding
 * - Single place to log all errors
 * - Consistent error response format
 * - Prevents accidental exposure of internal stack traces to clients
 *
 * ERROR HIERARCHY HANDLED:
 * 1. AppError (and subclasses) — Operational, known errors (404, 409, 401, etc.)
 * 2. ZodError — Validation failures that escape the validation middleware
 * 3. SyntaxError — Invalid JSON body (thrown by express.json() parser)
 * 4. Unknown errors — Bugs, unexpected failures → generic 500 (no internals leaked)
 *
 * NOTE ON `_next`:
 * Express requires the 4th parameter to be present (even unused) for it to recognize
 * this as an error handler. We prefix with _ to signal it's intentionally unused.
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  // Log every error that reaches this handler
  logger.error('[ErrorHandler] Caught unhandled error', {
    message: error.message,
    method: req.method,
    path: req.path,
    stack: error.stack,
    name: error.name,
  });

  // ── 1. Known operational errors (AppError and its subclasses) ─────────────
  if (error instanceof AppError) {
    APIErrorResponse(res, error.message, {}, error.statusCode);
    return;
  }

  // ── 2. Zod validation errors (escape route from validation middleware) ─────
  if (error instanceof ZodError) {
    APIErrorResponse(
      res,
      'Validation failed',
      {
        fieldErrors: error.flatten().fieldErrors,
        formErrors: error.flatten().formErrors,
      },
      HTTP_STATUS.BAD_REQUEST,
    );
    return;
  }

  // ── 3. JSON SyntaxError (malformed request body) ──────────────────────────
  // express.json() throws a SyntaxError with 'body' property when JSON is invalid
  if (error instanceof SyntaxError && 'body' in error) {
    APIErrorResponse(
      res,
      'Invalid JSON in request body',
      {},
      HTTP_STATUS.BAD_REQUEST,
    );
    return;
  }

  // ── 4. Unknown / unexpected errors ────────────────────────────────────────
  // DO NOT expose error.message here — it may contain sensitive internal details
  APIErrorResponse(
    res,
    'An unexpected error occurred. Please try again later.',
    {},
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
  );
};
