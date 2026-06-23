import { eq, ilike } from 'drizzle-orm';
import { db } from '../../config/database.config';
import { products } from './products.schema';
import { NotFoundError } from '../../utils/errors/not-found-error';
import { logger } from '../../logger/logger';
import type { CreateProductDto } from './dto/create-products.dto';
import type { UpdateProductDto } from './dto/update-products.dto';
import type { Product } from './products.schema';

/**
 * Products Service Layer
 *
 * WHAT IS THE SERVICE LAYER:
 * The service layer owns ALL business logic. It sits between controllers (HTTP layer)
 * and the database (data layer). Controllers call services; services call the DB.
 *
 * WHY NOT PUT DB CALLS IN CONTROLLERS:
 * - Testability: Services can be unit-tested without HTTP (just call the function)
 * - Reusability: Multiple controllers (or scheduled jobs) can reuse the same service
 * - Separation of concerns: Controllers handle HTTP in/out; services handle logic
 *
 * LOGGING CONVENTION (per architecture rules):
 * Every service function logs:
 * - [entry]: function called, with key input params
 * - [exit]: function completed successfully
 * - [error]: if something went wrong (then re-throws)
 *
 * NOTE ON price TYPE:
 * PostgreSQL NUMERIC is returned as a string by node-postgres to preserve precision.
 * When inserting, we convert the JS number to string: String(dto.price) = "29.99"
 */

// ── GET ALL ───────────────────────────────────────────────────────────────────
export const getAllProducts = async (): Promise<Product[]> => {
  logger.info('[ProductService] getAllProducts: entry');
  try {
    const result = await db.select().from(products);
    logger.info('[ProductService] getAllProducts: exit', { count: result.length });
    return result;
  } catch (error) {
    logger.error('[ProductService] getAllProducts: database query failed', { error });
    throw error;
  }
};

// ── SEARCH PRODUCTS ───────────────────────────────────────────────────────────
export const searchProducts = async (query: string): Promise<Product[]> => {
  logger.info('[ProductService] searchProducts: entry', { query });
  try {
    // Basic ilike search on product name
    const result = await db
      .select()
      .from(products)
      .where(ilike(products.name, `%${query}%`));
    
    logger.info('[ProductService] searchProducts: exit', { count: result.length });
    return result;
  } catch (error) {
    logger.error('[ProductService] searchProducts: database query failed', { error });
    throw error;
  }
};

// ── GET BY ID ─────────────────────────────────────────────────────────────────
export const getProductById = async (id: string): Promise<Product> => {
  logger.info('[ProductService] getProductById: entry', { id });
  try {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.id, id));

    if (result.length === 0) {
      throw new NotFoundError(`Product with id "${id}" not found`);
    }

    logger.info('[ProductService] getProductById: exit', { id });
    return result[0];
  } catch (error) {
    logger.error('[ProductService] getProductById: failed', { id, error });
    throw error;
  }
};

// ── CREATE ────────────────────────────────────────────────────────────────────
export const createProduct = async (dto: CreateProductDto): Promise<Product> => {
  logger.info('[ProductService] createProduct: entry', { name: dto.name });
  try {
    const result = await db
      .insert(products)
      .values({
        name: dto.name,
        description: dto.description ?? null,
        // Convert JS number to string for PostgreSQL NUMERIC type
        price: String(dto.price),
        stock: dto.stock,
        thumbnail: dto.thumbnail,
        images: dto.images,
        rating: dto.rating !== undefined ? String(dto.rating) : null,
        discountPercentage: dto.discountPercentage !== undefined ? String(dto.discountPercentage) : null,
        brand: dto.brand,
        category: dto.category,
        reviews: dto.reviews,
      })
      .returning();

    logger.info('[ProductService] createProduct: exit', { id: result[0].id });
    return result[0];
  } catch (error) {
    logger.error('[ProductService] createProduct: database insert failed', { error });
    throw error;
  }
};

// ── UPDATE (PATCH) ────────────────────────────────────────────────────────────
export const updateProduct = async (
  id: string,
  dto: UpdateProductDto,
): Promise<Product> => {
  logger.info('[ProductService] updateProduct: entry', { id, fields: Object.keys(dto) });
  try {
    // Build update payload — only include fields that were provided
    const updatePayload: Partial<typeof products.$inferInsert> = {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.price !== undefined && { price: String(dto.price) }),
      ...(dto.stock !== undefined && { stock: dto.stock }),
      ...(dto.thumbnail !== undefined && { thumbnail: dto.thumbnail }),
      ...(dto.images !== undefined && { images: dto.images }),
      ...(dto.rating !== undefined && { rating: dto.rating !== null ? String(dto.rating) : null }),
      ...(dto.discountPercentage !== undefined && { discountPercentage: dto.discountPercentage !== null ? String(dto.discountPercentage) : null }),
      ...(dto.brand !== undefined && { brand: dto.brand }),
      ...(dto.category !== undefined && { category: dto.category }),
      ...(dto.reviews !== undefined && { reviews: dto.reviews }),
      // Always update the updatedAt timestamp on any modification
      updatedAt: new Date(),
    };

    // .returning() gives us the updated row — if 0 rows updated, product didn't exist
    const result = await db
      .update(products)
      .set(updatePayload)
      .where(eq(products.id, id))
      .returning();

    if (result.length === 0) {
      throw new NotFoundError(`Product with id "${id}" not found`);
    }

    logger.info('[ProductService] updateProduct: exit', { id });
    return result[0];
  } catch (error) {
    logger.error('[ProductService] updateProduct: failed', { id, error });
    throw error;
  }
};

// ── DELETE ────────────────────────────────────────────────────────────────────
export const deleteProduct = async (id: string): Promise<void> => {
  logger.info('[ProductService] deleteProduct: entry', { id });
  try {
    // .returning() lets us know if the row existed — more efficient than SELECT + DELETE
    const deleted = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning({ id: products.id });

    if (deleted.length === 0) {
      throw new NotFoundError(`Product with id "${id}" not found`);
    }

    logger.info('[ProductService] deleteProduct: exit', { id });
  } catch (error) {
    logger.error('[ProductService] deleteProduct: failed', { id, error });
    throw error;
  }
};
