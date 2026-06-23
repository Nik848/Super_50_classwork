import { z } from 'zod';

/**
 * CreateProductSchema — Zod validation schema for POST /api/v1/products
 *
 * WHAT IS A DTO (Data Transfer Object):
 * A DTO is a contract that defines EXACTLY what data is expected at the boundary
 * of your application (the HTTP layer). It validates and transforms raw user input
 * before it ever reaches your service or database.
 *
 * WHY ZOD (NOT interfaces or types directly):
 * - TypeScript interfaces are COMPILE-TIME only — they don't exist at runtime
 * - Zod schemas exist at RUNTIME — they actually validate and transform data
 * - `z.infer<typeof Schema>` gives you the TypeScript type for FREE from the schema
 * - Single source of truth: schema and type in one place
 *
 * TRANSFORMATIONS APPLIED:
 * - `.trim()` strips leading/trailing whitespace from strings
 * - Zod's `.parse()` returns the transformed value, not the raw input
 */
export const CreateProductSchema = z.object({
  name: z
    .string({ required_error: 'name is required' })
    .min(1, 'name cannot be empty')
    .max(255, 'name cannot exceed 255 characters')
    .trim(),

  description: z
    .string()
    .max(2000, 'description cannot exceed 2000 characters')
    .trim()
    .optional(),

  price: z
    .number({ required_error: 'price is required', invalid_type_error: 'price must be a number' })
    .positive('price must be greater than 0')
    .multipleOf(0.01, 'price can have at most 2 decimal places'),

  stock: z
    .number({ invalid_type_error: 'stock must be a number' })
    .int('stock must be a whole number')
    .min(0, 'stock cannot be negative')
    .optional()
    .default(0),

  thumbnail: z.string().url('thumbnail must be a valid URL').optional(),
  
  images: z.array(z.string().url('image must be a valid URL')).optional().default([]),
  
  rating: z.number().min(0).max(5).optional(),
  
  discountPercentage: z.number().min(0).max(100).optional(),
  
  brand: z.string().max(255).optional(),
  
  category: z.string().max(255).optional(),
  
  reviews: z.array(z.any()).optional().default([]),
});

// Infer the TypeScript type from the schema — NO separate interface needed
export type CreateProductDto = z.infer<typeof CreateProductSchema>;
