/*
  ORIGINAL COMMENT:
  import:
      express
      cors
      cookie-parser
      morgan

  create express app
  add middlewares:
      body parser
      cookie parser
      morgan

  GET /health api{
      success:true,
      message:"ok"
  }

  attach auth router - api/v1/auth
  attach product router - api/v1/products

  start server at 6101

  IMPLEMENTATION:
  - dotenv loaded first so all env vars are available
  - Express app with cors, json body parser, cookie-parser, morgan
  - Health check at GET /health
  - Auth routes at /api/v1/auth
  - Product routes at /api/v1/products
  - Server listens on PORT from .env (default 6101)
*/
import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./auth/api/auth.router.js";
import productsRouter from "./auth/products/products.router.js";

const app = express();
const PORT = process.env.PORT || 6101;

// ───────────────── Middlewares ─────────────────
app.use(cors({ origin: true, credentials: true }));
app.use(express.json()); // body parser for JSON
app.use(cookieParser()); // parse cookies from request headers
app.use(morgan("dev")); // HTTP request logger

// ───────────────── Health Check ─────────────────
app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "ok",
  });
});

// ───────────────── Routes ─────────────────
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productsRouter);

// ───────────────── Start Server ─────────────────
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});