import { z } from 'zod';
import { CreateProductSchema } from './create-products.dto';

/**
 * UpdateProductSchema — Zod validation schema for PATCH /api/v1/products/:id
 *
 * WHY .partial():
 * PATCH semantics = update only the fields you send (partial update).
 * PUT semantics = replace the entire resource.
 *
 * Zod's `.partial()` makes EVERY field in CreateProductSchema optional.
 * This means the client can send just { price: 29.99 } to update only the price.
 *
 * WHY .refine() AT THE END:
 * With all fields optional, an empty body {} would pass schema validation.
 * The refine ensures at least ONE field must be provided — otherwise the
 * PATCH request has no effect, which is a client mistake we should catch.
 */
export const UpdateProductSchema = CreateProductSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided for update' },
  );

export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;
