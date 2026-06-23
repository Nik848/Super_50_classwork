/*
  ORIGINAL COMMENT:
  auth middleware
  1. check cookie for token -> false 401
  2. verify token jwt.verify(token, process.env.JWT_SECRET) -> false 401  and do not decode just verify - success data
  3. attach user to req for future verification
  4. call next

  IMPLEMENTATION:
  - Reads 'accessToken' from req.cookies
  - Returns 401 if token is missing or jwt.verify fails
  - Attaches verified payload to req.user (contains id, email)
  - Calls next() on success
*/
import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    // 1. Check cookie for token
    const token = req.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // 2. Verify token — jwt.verify throws on invalid/expired tokens
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user data to req for downstream use
    req.user = verified;

    // 4. Call next
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};
