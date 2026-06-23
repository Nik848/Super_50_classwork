/*
  NEW FILE: create-product.dto.js
  Zod schema to validate product creation requests.
  - name: required string
  - price: required positive number
  - stock: required non-negative integer
  - images: optional array of strings (URLs)
*/
import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.number().positive("Price must be a positive number"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  images: z.array(z.string().url("Each image must be a valid URL")).optional(),
});

// Express middleware: validates req.body against the create product schema
export const validateCreateProduct = (req, res, next) => {
  const result = createProductSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.errors,
    });
  }
  req.body = result.data;
  next();
};
