import { env } from './config/env.config';
import { logger } from './logger/logger';
import { connectDatabase } from './config/database.config';
import { createApp } from './app';

/**
 * server.ts — Application Entry Point
 *
 * RESPONSIBILITIES (strictly this file only):
 * 1. Environment variables are already loaded by env.config.ts (imported above)
 * 2. Initialize the database connection (fail fast if unreachable)
 * 3. Create the Express application
 * 4. Start the HTTP server
 * 5. Register process-level error handlers (unhandledRejection, uncaughtException)
 * 6. Register graceful shutdown handlers (SIGTERM, SIGINT)
 *
 * WHY GRACEFUL SHUTDOWN:
 * When a container orchestrator (Kubernetes, ECS) restarts your service, it sends
 * SIGTERM. Without a graceful shutdown handler, in-flight requests are abruptly
 * terminated. With it, the server stops accepting new connections and waits for
 * existing ones to finish before exiting.
 *
 * WHY HANDLE unhandledRejection:
 * If a Promise rejects and there's no .catch() handler, Node.js (< v15) silently
 * ignores it. In Node.js >= v15, it crashes with exit code 1. We log it and exit
 * cleanly with a proper error message for observability.
 */

const startServer = async (): Promise<void> => {
  try {
    // ── Step 1: Validate database connectivity ──────────────────────────────
    await connectDatabase();

    // ── Step 2: Create the Express application ──────────────────────────────
    const app = createApp();

    // ── Step 3: Start the HTTP server ───────────────────────────────────────
    const server = app.listen(env.PORT, () => {
      logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      logger.info('🚀 Server started successfully');
      logger.info(`   Port:        ${env.PORT}`);
      logger.info(`   Environment: ${env.NODE_ENV}`);
      logger.info(`   Health:      http://localhost:${env.PORT}/health`);
      logger.info(`   Products:    http://localhost:${env.PORT}/api/v1/products`);
      logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });

    // ── Step 4: Graceful Shutdown ────────────────────────────────────────────
    const shutdown = (signal: string): void => {
      logger.warn(`[Server] ${signal} received — initiating graceful shutdown`);
      server.close(() => {
        logger.info('[Server] HTTP server closed — all connections drained');
        logger.info('[Server] Process exiting');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM')); // Sent by container orchestrators
    process.on('SIGINT', () => shutdown('SIGINT'));   // Sent by Ctrl+C in terminal

    // ── Step 5: Process-Level Error Handlers ────────────────────────────────
    process.on('unhandledRejection', (reason: unknown) => {
      logger.error('[Server] Unhandled Promise Rejection — shutting down', { reason });
      server.close(() => process.exit(1));
    });

    process.on('uncaughtException', (error: Error) => {
      logger.error('[Server] Uncaught Exception — shutting down', {
        message: error.message,
        stack: error.stack,
      });
      // Do NOT attempt to resume — uncaught exceptions leave the app in undefined state
      process.exit(1);
    });
  } catch (error) {
    logger.error('[Server] Failed to start — exiting', { error });
    process.exit(1);
  }
};

startServer();
