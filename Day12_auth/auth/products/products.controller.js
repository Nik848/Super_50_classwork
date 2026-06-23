/*
  NEW FILE: products.controller.js
  CRUD controllers for products:
  - getProducts: list all products
  - createProduct: create a new product (attaches req.user.id as user_id)
  - updateProduct: update product by id (only the owner can update)
*/
import { eq, and } from "drizzle-orm";
import { db } from "../../config/db-congid.js";
import { products } from "../../schema/product.model.js";

// ───────────────── Get All Products ─────────────────
export const getProducts = async (req, res) => {
  try {
    const allProducts = await db.select().from(products);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: allProducts,
    });
  } catch (error) {
    console.error("Get products error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ───────────────── Create Product ─────────────────
export const createProduct = async (req, res) => {
  try {
    const { name, price, stock, images } = req.body;

    // req.user is set by authMiddleware (contains id, email from JWT)
    const userId = req.user.id;

    const newProduct = await db
      .insert(products)
      .values({
        name,
        price: String(price), // numeric column expects string representation
        stock,
        images: images || [],
        userId,
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct[0],
    });
  } catch (error) {
    console.error("Create product error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ───────────────── Update Product (PATCH) ─────────────────
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    // Check if the product exists and belongs to the current user
    const existing = await db
      .select()
      .from(products)
      .where(and(eq(products.id, productId), eq(products.userId, userId)))
      .limit(1);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found or you are not the owner",
      });
    }

    // Build update payload — only include fields that were sent
    const updateData = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.price !== undefined) updateData.price = String(req.body.price);
    if (req.body.stock !== undefined) updateData.stock = req.body.stock;
    if (req.body.images !== undefined) updateData.images = req.body.images;

    const updated = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, productId))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updated[0],
    });
  } catch (error) {
    console.error("Update product error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
