import { HTTP_STATUS } from '../../constants/http-status.constants';
import { AppError } from './app-error';

/**
 * UnauthorizedError — 401
 *
 * Thrown when a request requires authentication but none was provided,
 * or when the provided credentials are invalid/expired.
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized — authentication required') {
    super(message, HTTP_STATUS.UNAUTHORIZED);
  }
}
