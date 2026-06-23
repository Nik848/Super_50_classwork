/*
  ORIGINAL COMMENT:
  create a router

  attach these endpoints
  GET
      -dto
      -controller

  -auth middleware

  POST /
      -dto
      -controller
  PATCH /Productsid
      -dto
      -controller

  IMPLEMENTATION:
  - GET / is public (no auth middleware) — lists all products
  - POST / requires auth middleware — creates a product for the logged-in user
  - PATCH /:productId requires auth middleware — updates product (owner only)
  - Each endpoint uses its DTO validation middleware before the controller
*/
import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.validation.middleware.js";
import { validateGetProducts } from "./dto/get-products.dto.js";
import { validateCreateProduct } from "./dto/create-product.dto.js";
import { validateUpdateProduct } from "./dto/update-product.dto.js";
import {
  getProducts,
  createProduct,
  updateProduct,
} from "./products.controller.js";

const productsRouter = Router();

// GET / — list all products (public, no auth needed)
productsRouter.get("/", validateGetProducts, getProducts);

// POST / — create product (auth required)
productsRouter.post("/", authMiddleware, validateCreateProduct, createProduct);

// PATCH /:productId — update product by id (auth required, owner only)
productsRouter.patch(
  "/:productId",
  authMiddleware,
  validateUpdateProduct,
  updateProduct
);

export default productsRouter;