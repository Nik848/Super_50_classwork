import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middleware/validation.middleware';
import { CreateProductSchema } from './dto/create-products.dto';
import { UpdateProductSchema } from './dto/update-products.dto';
import * as productController from './products.controller';

/**
 * Products Router
 *
 * ROUTE DESIGN:
 * This router is mounted at /api/v1/products in app.ts.
 * All paths here are RELATIVE to that mount point.
 *
 * MIDDLEWARE ORDER (matters):
 * 1. validate({ params: ProductParamsSchema }) — validate :id format first
 * 2. validate({ body: ... }) — validate body shape
 * 3. controller — only runs if all validation passes
 *
 * ProductParamsSchema — UUID validation on :id params:
 * Why validate the UUID format at the route level?
 * If we pass a non-UUID string to a PostgreSQL UUID column, the DB throws a
 * `invalid input syntax for type uuid` error — an unhandled crash.
 * Validating upfront returns a clean 400 before touching the database.
 */

const router = Router();

// Validate that :id params are valid UUIDs
const ProductParamsSchema = z.object({
  id: z.string().uuid('Product ID must be a valid UUID (e.g. 550e8400-e29b-41d4-a716-446655440000)'),
});

// ── GET /api/v1/products ──────────────────────────────────────────────────────
router.get('/', productController.getAllProducts);

// ── GET /api/v1/products/:id ──────────────────────────────────────────────────
router.get(
  '/:id',
  validate({ params: ProductParamsSchema }),
  productController.getProductById,
);

// ── POST /api/v1/products ─────────────────────────────────────────────────────
router.post(
  '/',
  validate({ body: CreateProductSchema }),
  productController.createProduct,
);

// ── PATCH /api/v1/products/:id ────────────────────────────────────────────────
router.patch(
  '/:id',
  validate({ params: ProductParamsSchema, body: UpdateProductSchema }),
  productController.updateProduct,
);

// ── DELETE /api/v1/products/:id ───────────────────────────────────────────────
router.delete(
  '/:id',
  validate({ params: ProductParamsSchema }),
  productController.deleteProduct,
);

export default router;
