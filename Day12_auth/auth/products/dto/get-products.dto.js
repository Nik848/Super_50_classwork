/*
  NEW FILE: get-products.dto.js
  GET /products requires no request body validation.
  This is a pass-through middleware for consistency with the DTO pattern.
*/

// Express middleware: no validation needed for GET products, just pass through
export const validateGetProducts = (req, res, next) => {
  next();
};
