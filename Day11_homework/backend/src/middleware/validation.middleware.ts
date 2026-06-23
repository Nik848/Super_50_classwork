import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { APIErrorResponse } from '../utils/api-response';
import { HTTP_STATUS } from '../constants/http-status.constants';
import { logger } from '../logger/logger';

/**
 * Validation Middleware — Zod-powered request validation
 *
 * WHAT IS A DTO (Data Transfer Object):
 * A DTO defines the exact shape of data that flows between layers.
 * It documents what a request must look like — required fields, types, constraints.
 *
 * WHY ZOD OVER MANUAL VALIDATION:
 * - Declarative: Schema IS the documentation
 * - Type inference: `z.infer<typeof Schema>` gives you free TypeScript types
 * - Composable: .partial(), .pick(), .extend(), .merge()
 * - Safe parsing: .safeParse() won't throw
 *
 * WHY ZOD OVER JOI OR YUP:
 * - Zod is TypeScript-first (Joi/Yup predate TS)
 * - Zod's type inference is more accurate
 * - Increasingly the industry standard for TS projects
 *
 * HOW THIS MIDDLEWARE WORKS:
 * 1. You provide schemas for body/query/params (all optional)
 * 2. Each present schema is used to parse (and transform) the request data
 * 3. On ZodError → returns a standardized 400 with field-level errors
 * 4. On success → mutates req.body/query/params with the parsed (transformed) values
 *    This is important: Zod .parse() returns the TRANSFORMED value (e.g., trim, coerce)
 *    so downstream controllers always receive clean data.
 */

interface ValidateSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export const validate = (schemas: ValidateSchemas) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        // Replace req.body with the parsed (transformed) value
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as typeof req.query;
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as typeof req.params;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn('[ValidationMiddleware] Request validation failed', {
          method: req.method,
          path: req.path,
          fieldErrors: error.flatten().fieldErrors,
          formErrors: error.flatten().formErrors,
        });

        APIErrorResponse(
          res,
          'Validation failed',
          // Include both field-level and form-level errors in the response
          {
            fieldErrors: error.flatten().fieldErrors,
            formErrors: error.flatten().formErrors,
          },
          HTTP_STATUS.BAD_REQUEST,
        );
        return;
      }

      // Unknown error during validation — forward to error handler
      next(error);
    }
  };
};
