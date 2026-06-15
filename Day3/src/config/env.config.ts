import * as dotenv from 'dotenv';
import { z } from 'zod';

/**
 * env.config.ts — Centralized Environment Variable Configuration
 *
 * WHAT IT IS:
 * A single source of truth for all environment variables. It loads the .env file,
 * validates every variable against a Zod schema, and exports a typed `env` object.
 *
 * WHY ZOD FOR ENV VALIDATION:
 * - Fail-fast: If a required env var is missing, the process crashes at startup
 *   (not mid-request when the first user hits the broken endpoint).
 * - Type safety: `env.PORT` is a `number`, not a `string`. No more parseInt() everywhere.
 * - Documentation: The schema IS the documentation for what env vars exist and their types.
 *
 * WHY dotenv.config() IS CALLED HERE:
 * This makes env.config.ts self-contained. Any module that imports `env` can be sure
 * the .env file has been loaded, regardless of import order in server.ts.
 *
 * ALTERNATIVES:
 * - env-var (npm package)
 * - joi (heavier, more common in NestJS)
 * - Manual process.env with type assertions (not type-safe)
 */

// Load .env file into process.env before parsing
dotenv.config();

const envSchema = z.object({
  // ── Server ──────────────────────────────────────────────────────────────
  PORT: z
    .string()
    .default('3000')
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), { message: 'PORT must be a valid number' }),

  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // ── Logging ─────────────────────────────────────────────────────────────
  LOG_LEVEL: z
    .enum(['error', 'warn', 'info', 'http', 'debug'])
    .default('http'),

  // ── Database ─────────────────────────────────────────────────────────────
  DATABASE_URL: z
    .string({ required_error: 'DATABASE_URL is required' })
    .min(1, 'DATABASE_URL cannot be empty'),

  // ── CORS ─────────────────────────────────────────────────────────────────
  ALLOWED_ORIGINS: z.string().default('*'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // Using console.error here is intentional — Winston is not yet initialized
  // at this point. This is a valid exception to the "no console.*" rule.
  console.error('❌ Invalid environment variables detected:');
  console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
