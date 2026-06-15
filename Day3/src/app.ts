import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env.config';
import { logger } from './logger/logger';
import { errorHandler } from './middleware/error-handler.middleware';
import { APISuccessResponse, APIErrorResponse } from './utils/api-response';
import { HTTP_STATUS } from './constants/http-status.constants';
import productRoutes from './app/products/products.routes';

/**
 * createApp — Express Application Factory
 *
 * WHY A FACTORY FUNCTION:
 * Returning a factory function instead of directly exporting `app` makes the
 * application easier to test (create a fresh app per test) and clearly separates
 * the concern of "building the app" from "starting the server".
 *
 * MIDDLEWARE REGISTRATION ORDER (critical):
 * 1. Security middleware (helmet, cors) — first line of defense
 * 2. Parsing middleware (json, urlencoded, cookieParser) — prepare req.body
 * 3. Logging middleware (morgan) — log every request
 * 4. Routes — handle business requests
 * 5. 404 handler — catch unmatched routes
 * 6. Error handler — MUST be last (Express identifies it by 4 params)
 */
export const createApp = (): express.Application => {
  const app = express();

  // ── Security Middleware ──────────────────────────────────────────────────
  // Helmet: Sets secure HTTP headers (X-Content-Type-Options, X-Frame-Options, etc.)
  app.use(helmet());

  // CORS: Controls which origins can make cross-origin requests
  app.use(
    cors({
      origin: env.ALLOWED_ORIGINS === '*' ? '*' : env.ALLOWED_ORIGINS.split(','),
      credentials: true, // Allow cookies/auth headers on cross-origin requests
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    }),
  );

  // ── Parsing Middleware ───────────────────────────────────────────────────
  // Parse JSON request bodies (populates req.body)
  app.use(express.json());

  // Parse URL-encoded bodies (HTML forms)
  app.use(express.urlencoded({ extended: true }));

  // Parse cookies (populates req.cookies)
  app.use(cookieParser());

  // ── HTTP Request Logging (Morgan → Winston) ──────────────────────────────
  // Morgan intercepts HTTP logs; we pipe them through Winston for unified logging
  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => logger.http(message.trim()),
      },
    }),
  );
  app.use((_req: Request, _res: Response, next: NextFunction) => { 
    setTimeout(()=> {next();},10000);
   });

  // ── Health Check ─────────────────────────────────────────────────────────
  // GET /health — used by load balancers, orchestrators (Kubernetes), and monitoring
  app.get('/health', (_req: Request, res: Response) => {
    logger.info('[App] Health check requested');
    APISuccessResponse(res, 'Application is healthy', {});
  });

  // ── API Routes ────────────────────────────────────────────────────────────
  app.use('/api/v1/products', productRoutes);

  // ── 404 Handler ───────────────────────────────────────────────────────────
  // Catches any request that didn't match a registered route
  app.use((req: Request, res: Response) => {
    logger.warn('[App] 404 — Route not found', {
      method: req.method,
      path: req.path,
    });
    APIErrorResponse(
      res,
      `Cannot ${req.method} ${req.path}`,
      {},
      HTTP_STATUS.NOT_FOUND,
    );
  });

  // ── Global Error Handler ──────────────────────────────────────────────────
  // MUST be registered last — Express identifies error handlers by their 4 params
  app.use(errorHandler);

  return app;
};
