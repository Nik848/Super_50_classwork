import { HTTP_STATUS } from '../../constants/http-status.constants';
import { AppError } from './app-error';

/**
 * NotFoundError — 404
 *
 * Thrown when a requested resource does not exist in the database.
 * Example: GET /api/v1/products/:id where the product doesn't exist.
 */
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}
