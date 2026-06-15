import { Response } from 'express';
import { HTTP_STATUS, HttpStatusCode } from '../constants/http-status.constants';

/**
 * APISuccessResponse
 *
 * Standardized success response shape: { success: true, message, data }
 *
 * WHY THIS EXISTS:
 * Consistent response shapes across all endpoints allow API consumers (frontend,
 * mobile, third-party integrators) to write generic response handlers instead of
 * dealing with endpoint-specific shapes. This is an industry best practice.
 *
 * USAGE:
 * APISuccessResponse(res, 'Products retrieved', productsArray, HTTP_STATUS.OK);
 */
export const APISuccessResponse = <T>(
  res: Response,
  message: string,
  data: T,
  statusCode: HttpStatusCode = HTTP_STATUS.OK,
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * APIErrorResponse
 *
 * Standardized error response shape: { success: false, message, data }
 *
 * The `data` field carries validation error details when applicable,
 * and is an empty object `{}` for generic errors to avoid leaking internals.
 *
 * USAGE:
 * APIErrorResponse(res, 'Not found', {}, HTTP_STATUS.NOT_FOUND);
 */
export const APIErrorResponse = (
  res: Response,
  message: string,
  data: object = {},
  statusCode: HttpStatusCode | number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    data,
  });
};
