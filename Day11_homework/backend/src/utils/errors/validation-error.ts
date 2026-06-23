import { HTTP_STATUS } from '../../constants/http-status.constants';
import { AppError } from './app-error';

/**
 * ValidationError — 400
 *
 * Thrown when business-level validation fails in the service layer
 * (distinct from Zod schema validation, which is handled by the middleware).
 *
 * Example: Attempting to set stock to negative when business rules forbid it.
 */
export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, HTTP_STATUS.BAD_REQUEST);
  }
}
