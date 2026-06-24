/**
 * AUTH ROUTES
 *
 * POST /register
 * POST /login
 * POST /logout
 *
 * Registration creates EMP only.
 *
 * Login returns JWT cookie.
 */

/**
 * IMPLEMENTATION:
 * - POST /register → validateRegister DTO → registerUser controller
 *   Public route — anyone can register (creates EMP user)
 *
 * - POST /login → validateLogin DTO → loginUser controller
 *   Public route — returns JWT in HTTP-only cookie
 *
 * - POST /logout → authenticate middleware → logoutUser controller
 *   Protected route — only logged-in users can logout (clears cookie)
 *
 * These routes are mounted at /rest/onboardings in app.js
 */
import { Router } from "express";
import { validateRegister } from "./api/dto/register.dto.js";
import { validateLogin } from "./api/dto/login.dto.js";
import { registerUser, loginUser, logoutUser } from "./auth.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();

// POST /rest/onboardings/register — Create a new EMP user
router.post("/register", validateRegister, registerUser);

// POST /rest/onboardings/login — Authenticate and receive JWT cookie
router.post("/login", validateLogin, loginUser);

// POST /rest/onboardings/logout — Clear JWT cookie (must be logged in)
router.post("/logout", authenticate, logoutUser);

export default router;