/**
 * JWT UTILITIES
 *
 * Uses jsonwebtoken to sign and verify JSON Web Tokens.
 * JWT is used for stateless authentication — token stored in HTTP-only cookies.
 *
 * Functions:
 * - generateToken: creates a signed JWT with userId and role in payload
 * - verifyToken: decodes and verifies a JWT, returns the payload or throws
 *
 * Token expiry is set to 24 hours.
 * Secret is read from JWT_SECRET environment variable.
 */
import jwt from "jsonwebtoken";

// JWT secret from environment — must be set in .env
const JWT_SECRET = process.env.JWT_SECRET;

// Token validity duration
const TOKEN_EXPIRY = "24h";

/**
 * Generate a signed JWT token
 * @param {object} payload - data to encode (e.g., { userId, role })
 * @returns {string} - signed JWT string
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
};

/**
 * Verify and decode a JWT token
 * @param {string} token - the JWT string to verify
 * @returns {object} - decoded payload (e.g., { userId, role, iat, exp })
 * @throws {JsonWebTokenError} - if token is invalid or expired
 */
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
