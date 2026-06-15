import { HTTP_STATUS } from '../../constants/http-status.constants';
import { AppError } from './app-error';

/**
 * ConflictError — 409
 *
 * Thrown when a create/update operation violates a uniqueness constraint.
 * Example: Creating a product with a name that already exists (if unique).
 */
export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, HTTP_STATUS.CONFLICT);
  }
}
