/**
 * Express Type Augmentations
 *
 * This file extends the global Express namespace to add custom properties
 * to the Request and Response objects.
 *
 * HOW TO USE:
 * Uncomment and add properties here as the app grows.
 *
 * EXAMPLE — After adding authentication middleware:
 *   interface Request {
 *     user?: { id: string; email: string; role: string };
 *     requestId?: string;
 *   }
 */

// The `export {}` makes this a module (required for global augmentation to work)
export {};

declare global {
  namespace Express {
    interface Request {
      // Add custom request properties here
      // requestId?: string;
    }
  }
}
