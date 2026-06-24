/**
 * AUTH CONTROLLER
 *
 * Responsibilities:
 * - Receive request
 * - Call service
 * - Return standardized response
 *
 * No business logic here.
 */

/**
 * IMPLEMENTATION:
 *
 * registerUser(req, res):
 * - Extracts validated body (name, email, password) from req.body
 * - Calls auth service register
 * - Returns 201 Created with ApiResponse
 *
 * loginUser(req, res):
 * - Extracts validated body (email, password) from req.body
 * - Calls auth service login
 * - Sets JWT as HTTP-only cookie (secure, prevents XSS)
 * - Returns 200 OK with user data
 *
 * logoutUser(req, res):
 * - Clears the "token" cookie
 * - Returns 200 OK with success message
 *
 * Cookie configuration:
 * - httpOnly: true  → JS cannot read the cookie (prevents XSS)
 * - secure: false   → allow HTTP in development (set true in production)
 * - sameSite: "lax" → CSRF protection
 * - maxAge: 24h     → matches JWT expiry
 */
import * as authService from "./auth.service.js";
import { ApiResponse } from "../../utils/ApiSuccessResponse.js";

// Cookie options for JWT storage
const COOKIE_OPTIONS = {
  httpOnly: true, // Prevents client-side JS from reading the cookie
  secure: false, // Set to true in production (HTTPS only)
  sameSite: "lax", // Protects against CSRF
  maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds (matches JWT expiry)
};

/**
 * Handle user registration
 * POST /rest/onboardings/register
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Call the auth service to register the user (business logic is in service)
    const user = await authService.register({ name, email, password });

    // Return 201 Created with the new user data
    const response = new ApiResponse(201, "User registered successfully.", user);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    // If it's a known ApiError (e.g., duplicate email), forward statusCode
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Registration failed.",
    });
  }
};

/**
 * Handle user login
 * POST /rest/onboardings/login
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Call the auth service to validate credentials and get JWT
    const { user, token } = await authService.login({ email, password });

    // Set the JWT token as an HTTP-only cookie
    res.cookie("token", token, COOKIE_OPTIONS);

    // Return 200 OK with user data
    const response = new ApiResponse(200, "Login successful.", user);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Login failed.",
    });
  }
};

/**
 * Handle user logout
 * POST /rest/onboardings/logout
 */
export const logoutUser = async (req, res) => {
  try {
    // Clear the "token" cookie to log the user out
    res.clearCookie("token", COOKIE_OPTIONS);

    // Return 200 OK with success message
    const response = new ApiResponse(200, "Logged out successfully.");
    return res.status(response.statusCode).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed.",
    });
  }
};