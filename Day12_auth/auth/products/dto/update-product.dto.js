/*
  NEW FILE: update-product.dto.js
  Zod schema to validate product update (PATCH) requests.
  - All fields are optional (partial update)
  - Uses .partial() on the create schema shape
*/
import { z } from "zod";

export const updateProductSchema = z.object({
  name: z.string().min(1, "Product name is required").optional(),
  price: z.number().positive("Price must be a positive number").optional(),
  stock: z.number().int().min(0, "Stock cannot be negative").optional(),
  images: z
    .array(z.string().url("Each image must be a valid URL"))
    .optional(),
});

// Express middleware: validates req.body against the update product schema
export const validateUpdateProduct = (req, res, next) => {
  const result = updateProductSchema.safeParse(req.body);
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
