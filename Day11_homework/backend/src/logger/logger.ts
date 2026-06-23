import winston from 'winston';
import { env } from '../config/env.config';

/**
 * Logger — Centralized Winston Logger
 *
 * WHAT IT IS:
 * A singleton logger instance that all layers of the application import and use.
 *
 * WHY WINSTON:
 * - Supports multiple transports (Console, File, HTTP, etc.) simultaneously
 * - Structured logging with metadata objects (key for production log aggregation)
 * - Log levels (error, warn, info, http, debug) give fine-grained control
 * - JSON format in production integrates cleanly with tools like Datadog, Splunk, CloudWatch
 *
 * WHY NO console.log:
 * console.log has no log levels, no structured metadata, no transport system,
 * and no way to control verbosity per environment. Winston solves all of these.
 *
 * ALTERNATIVES:
 * - Pino (fastest JSON logger, preferred in high-throughput services)
 * - Bunyan (similar to Pino)
 * - Morgan (HTTP-specific only, not general purpose — we use it separately)
 *
 * LOG LEVELS (Winston default hierarchy, lower number = higher priority):
 * error: 0 | warn: 1 | info: 2 | http: 3 | verbose: 4 | debug: 5 | silly: 6
 */

const { combine, timestamp, printf, colorize, errors, json, align } = winston.format;

// ── Development Format: Human-readable with colors ────────────────────────────
const developmentFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }), // Include stack traces for Error objects
  align(),
  printf(({ level, message, timestamp: ts, stack, ...meta }) => {
    const metaStr =
      Object.keys(meta).length > 0
        ? `\n  ${JSON.stringify(meta, null, 2)}`
        : '';
    return stack
      ? `${ts} [${level}]: ${message}\n${stack}${metaStr}`
      : `${ts} [${level}]: ${message}${metaStr}`;
  }),
);

// ── Production Format: Structured JSON for log aggregators ───────────────────
const productionFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json(),
);

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: env.NODE_ENV === 'production' ? productionFormat : developmentFormat,
  transports: [
    // Always log to console
    new winston.transports.Console(),

    // Error log — separate file for easier filtering in production
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(timestamp(), errors({ stack: true }), json()),
    }),

    // Combined log — all levels
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: combine(timestamp(), errors({ stack: true }), json()),
    }),
  ],
  // Do not crash the process on logger errors
  exitOnError: false,
});
