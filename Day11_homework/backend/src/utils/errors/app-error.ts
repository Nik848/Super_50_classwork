/**
 * AppError — Base Custom Error Class
 *
 * WHY A CLASS HERE:
 * Custom error classes are one of the two approved uses of classes in this codebase
 * (the other being the Logger). They extend the built-in Error class to preserve
 * the prototype chain and allow `instanceof` checks in the error handler middleware.
 *
 * WHAT IT IS:
 * A base error class that all operational errors (NotFoundError, ConflictError, etc.)
 * extend. It carries an HTTP status code alongside the message.
 *
 * WHY `isOperational`:
 * Distinguishes "expected" errors (user did something wrong) from "unexpected" errors
 * (bugs, DB crashes). The error handler can use this to decide whether to send a
 * detailed message or a generic "something went wrong" response.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);

    // Restore the prototype chain after extending built-in Error
    // Required in TypeScript when targeting ES5/ES6 due to how TS compiles class extends
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Captures a proper stack trace pointing to where the error was thrown
    // (not inside this constructor)
    Error.captureStackTrace(this, this.constructor);
  }
}
