/*
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


  attach onboarding router - /rest/onboardings
  attach roles router - /rest/roles
  attach employee router - /rest/employees
  attach reimbursements router - /rest/reimbursements


  start server on port 8080
*/

/**
 * IMPLEMENTATION:
 * - Loads environment variables first via dotenv
 * - Creates Express app with standard middlewares:
 *   cors (cross-origin), json body parser, cookie-parser, morgan (logging)
 * - Health check endpoint at GET /health
 * - Mounts module routers:
 *   /rest/onboardings → auth routes (register, login, logout)
 *   /rest/roles → role management routes (CFO assigns roles)
 *   /rest/employees → employee management routes (listing, assignment)
 *   /rest/reimbursements → NOT IMPLEMENTED (as per requirements)
 * - Exports the app for use in server.js
 */
import "dotenv/config"; // Load .env variables FIRST before any other imports
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

// Import module routers
import authRouter from "./app/auth/auth.routes.js";
import rolesRouter from "./app/roles/roles.routes.js";
import employeesRouter from "./app/employee/employees.routes.js";

// Create the Express application
const app = express();

// ───────────────── Middlewares ─────────────────
app.use(cors({ origin: true, credentials: true })); // Enable CORS with credentials (cookies)
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies from request headers
app.use(morgan("dev")); // HTTP request logger (dev format: colored, concise)

// ───────────────── Health Check ─────────────────
// Simple endpoint to verify the server is running
app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "ok",
  });
});

// ───────────────── Routes ─────────────────
// Auth routes: register, login, logout
app.use("/rest/onboardings", authRouter);

// Role management routes: assign roles (CFO only)
app.use("/rest/roles", rolesRouter);

// Employee management routes: listing, assign/remove EMP↔RM
app.use("/rest/employees", employeesRouter);

// Reimbursements: NOT IMPLEMENTED (as per requirements — will be added later)
// app.use("/rest/reimbursements", reimbursementsRouter);

// Export app for server.js to start
export default app;