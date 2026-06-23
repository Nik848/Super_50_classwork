import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { APISuccessResponse } from '../../utils/api-response';
import { HTTP_STATUS } from '../../constants/http-status.constants';
import { logger } from '../../logger/logger';
import * as productService from './products.services';
import type { CreateProductDto } from './dto/create-products.dto';
import type { UpdateProductDto } from './dto/update-products.dto';

/**
 * Products Controller
 *
 * WHAT IS A CONTROLLER:
 * The controller is the HTTP boundary layer. Its ONLY responsibilities are:
 * 1. Extract data from the request (body, params, query)
 * 2. Call the appropriate service function
 * 3. Send the standardized response
 *
 * WHAT THE CONTROLLER MUST NOT DO:
 * - Business logic (belongs in service)
 * - Database queries (belongs in service)
 * - try/catch (handled by asyncHandler + error middleware)
 *
 * LOGGING CONVENTION:
 * Every controller logs [entry] and [exit] with relevant identifiers.
 * Errors are NOT logged here — they propagate up and are logged by the error handler.
 *
 * WHY asyncHandler:
 * All functions are wrapped in asyncHandler so that any async error is automatically
 * forwarded to next(err) → error handler middleware — no try/catch needed.
 */

// ── GET /api/v1/products ──────────────────────────────────────────────────────
export const getAllProducts = asyncHandler(async (_req: Request, res: Response) => {
  logger.info('[ProductController] getAllProducts: entry');

  const products = await productService.getAllProducts();

  logger.info('[ProductController] getAllProducts: exit', { count: products.length });
  APISuccessResponse(res, 'Products retrieved successfully', products);
});

// ── GET /api/v1/products/search ───────────────────────────────────────────────
export const searchProducts = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query.q as string;
  
  if (!query) {
    logger.info('[ProductController] searchProducts: entry without query, returning all');
    const products = await productService.getAllProducts();
    APISuccessResponse(res, 'Products retrieved successfully', products);
    return;
  }

  logger.info('[ProductController] searchProducts: entry', { query });
  const products = await productService.searchProducts(query);

  logger.info('[ProductController] searchProducts: exit', { count: products.length });
  APISuccessResponse(res, 'Products searched successfully', products);
});

// ── GET /api/v1/products/:id ──────────────────────────────────────────────────
export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  logger.info('[ProductController] getProductById: entry', { id });

  const product = await productService.getProductById(id);

  logger.info('[ProductController] getProductById: exit', { id });
  APISuccessResponse(res, 'Product retrieved successfully', product);
});

// ── POST /api/v1/products ─────────────────────────────────────────────────────
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const dto = req.body as CreateProductDto;
  logger.info('[ProductController] createProduct: entry', { name: dto.name });

  const product = await productService.createProduct(dto);

  logger.info('[ProductController] createProduct: exit', { id: product.id });
  APISuccessResponse(res, 'Product created successfully', product, HTTP_STATUS.CREATED);
});

// ── PATCH /api/v1/products/:id ────────────────────────────────────────────────
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const dto = req.body as UpdateProductDto;
  logger.info('[ProductController] updateProduct: entry', { id });

  const product = await productService.updateProduct(id, dto);

  logger.info('[ProductController] updateProduct: exit', { id });
  APISuccessResponse(res, 'Product updated successfully', product);
});

// ── DELETE /api/v1/products/:id ───────────────────────────────────────────────
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  logger.info('[ProductController] deleteProduct: entry', { id });

  await productService.deleteProduct(id);

  logger.info('[ProductController] deleteProduct: exit', { id });
  APISuccessResponse(res, 'Product deleted successfully', {});
});
