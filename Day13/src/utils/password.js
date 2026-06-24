/**
 * PASSWORD UTILITIES
 *
 * Uses bcryptjs for hashing and comparing passwords.
 * bcryptjs is a pure JS implementation (no native bindings needed).
 *
 * Functions:
 * - hashPassword: takes plain text password, returns bcrypt hash (10 salt rounds)
 * - comparePassword: compares plain text against stored hash, returns boolean
 */
import bcrypt from "bcryptjs";

// Number of salt rounds for bcrypt hashing — 10 is a good balance of security and speed
const SALT_ROUNDS = 10;

/**
 * Hash a plain text password using bcrypt
 * @param {string} plainPassword - the raw password from user input
 * @returns {Promise<string>} - the bcrypt hashed password
 */
export const hashPassword = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
};

/**
 * Compare a plain text password against a bcrypt hash
 * @param {string} plainPassword - the raw password from user input
 * @param {string} hashedPassword - the stored bcrypt hash from the database
 * @returns {Promise<boolean>} - true if they match, false otherwise
 */
export const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
