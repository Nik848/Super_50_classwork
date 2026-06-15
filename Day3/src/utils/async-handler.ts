/**
 * asyncHandler — Async Controller Wrapper
 *
 * WHAT IT IS:
 * A higher-order function that wraps an async Express route handler.
 *
 * WHY IT EXISTS:
 * In Express 4.x, if an async function throws (or a promise rejects), Express does NOT
 * automatically forward the error to the error-handling middleware. You'd need a try/catch
 * in EVERY controller, which is repetitive boilerplate.
 *
 * HOW IT WORKS:
 * It wraps the async handler in Promise.resolve().catch(next), so any rejection is
 * automatically forwarded to Express's next(err), triggering the error handler middleware.
 *
 * INDUSTRY USAGE:
 * This pattern is ubiquitous in Express 4.x codebases. Express 5.x natively handles
 * async errors, but Express 4.x (the current LTS) requires this wrapper.
 *
 * ALTERNATIVES:
 * - express-async-errors (npm package that monkey-patches Express)
 * - Try/catch in every controller (not DRY)
 * - Upgrade to Express 5.x (not yet LTS)
 */
import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
