# Day 3: Production-Ready Express.js + TypeScript REST API

Welcome to the **Day 3** backend development module! This project implements a production-grade, highly structured REST API using **Express.js**, **TypeScript**, **Drizzle ORM**, and **Supabase (PostgreSQL)**, with runtime validation powered by **Zod** and logging powered by **Winston**.

This guide is written specifically to help beginners understand **what** every file does, **why** we need it, **how** the architectural patterns connect, and **how** you can build a project like this yourself from scratch.

---

## Table of Contents
1. [Prerequisites & Required Changes to Run](#1-prerequisites--required-changes-to-run)
2. [Step-by-Step Running Guide](#2-step-by-step-running-guide)
3. [Folder & File Architecture (What is what?)](#3-folder--file-architecture-what-is-what)
4. [How to Recreate This From Scratch](#4-how-to-recreate-this-from-scratch)
5. [Core Concepts Explained for Beginners](#5-core-concepts-explained-for-beginners)
6. [Testing the API Endpoints](#6-testing-the-api-endpoints)

---

## 1. Prerequisites & Required Changes to Run

Before running the server, you must make **one crucial configuration change**:

### ⚠️ Configure your Database Connection
The project is configured to connect to a PostgreSQL database (like Supabase). Currently, the `.env` file contains a placeholder:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres
```
Because the server is designed to "fail-fast," **it will immediately crash on startup if it cannot connect to a database**. You must replace this placeholder with a valid PostgreSQL connection string.

#### Option A: Using Supabase (Recommended)
1. Go to [Supabase](https://supabase.com/) and create a free project.
2. In your Supabase dashboard, navigate to **Project Settings** (gear icon) -> **Database**.
3. Under **Connection Strings**, select **URI** and copy the **Direct connection** string (which usually connects to port `5432`).
4. Replace `YOUR_PASSWORD` in the copied string with the password you set when creating the Supabase project.
5. Paste it as `DATABASE_URL` in your `.env` file.

#### Option B: Using Local PostgreSQL
If you have PostgreSQL installed locally, you can use:
```env
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database_name>
```

---

## 2. Step-by-Step Running Guide

Once you have set up your `.env` file, open your terminal in the `Day3` folder and run the following commands:

### Step 1: Install Dependencies
Download and install all package dependencies listed in `package.json`:
```bash
npm install
```

### Step 2: Generate Database Migrations
Drizzle ORM reads your TypeScript schema (`src/app/products/products.schema.ts`) and compiles it into database-agnostic SQL migration scripts.
```bash
npm run db:generate
```
*This command will create a `/migrations` folder in your project containing SQL files.*

### Step 3: Run Database Migrations
Apply the generated SQL migrations to your Supabase/PostgreSQL database to create the `products` table.
```bash
npm run db:migrate
```
*(Alternative: During development, you can use `npm run db:push` to sync your database schema directly with your TypeScript file without creating migration files).*

### Step 4: Run the Development Server
Start the server in watch mode using Nodemon. The server will automatically reload when you save changes to your code.
```bash
npm run dev
```

You should see a console output like this:
```text
[Database] Attempting to connect to PostgreSQL...
[Database] ✅ PostgreSQL connection established successfully
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Server started successfully
   Port:        3000
   Environment: development
   Health:      http://localhost:3000/health
   Products:    http://localhost:3000/api/v1/products
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 3. Folder & File Architecture (What is what?)

A modular, clean-architecture directory layout is used to separate concerns. Here is a breakdown of every folder and file:

```text
Day3/
├── migrations/             # Generated SQL migration files (schema history)
├── src/
│   ├── app/                # Feature-based business modules
│   │   └── products/       # Products module (contains all product logic)
│   │       ├── dto/        # Data Transfer Objects (request validation schemas)
│   │       │   ├── create-products.dto.ts
│   │       │   └── update-products.dto.ts
│   │       ├── products.controller.ts  # HTTP Request/Response Handler
│   │       ├── products.routes.ts      # Product Endpoints Configuration
│   │       ├── products.schema.ts      # Database Table Definition (Drizzle)
│   │       └── products.services.ts    # Business Logic & Database Queries
│   ├── config/             # App Configurations
│   │   ├── database.config.ts          # Postgres pool and Drizzle setup
│   │   └── env.config.ts               # Env loading and Zod schema validation
│   ├── constants/          # Shared immutable values
│   │   └── http-status.constants.ts    # Centralized HTTP status codes (200, 404, etc.)
│   ├── logger/             # Logging Configuration
│   │   └── logger.ts                   # Winston structured logger config
│   ├── middleware/         # Express Middlewares
│   │   ├── error-handler.middleware.ts # Global centralized error handler
│   │   └── validation.middleware.ts    # Request payload validator (Zod)
│   ├── utils/              # Helper utilities
│   │   ├── errors/         # Custom operational error classes
│   │   │   ├── app-error.ts            # Base custom error class
│   │   │   ├── conflict-error.ts       # 409 Conflict Error
│   │   │   ├── not-found-error.ts      # 404 Not Found Error
│   │   │   ├── unauthorized-error.ts   # 401 Unauthorized Error
│   │   │   └── validation-error.ts     # 400 Bad Request (Business Validation)
│   │   ├── api-response.ts             # Standardized HTTP response wrappers
│   │   └── async-handler.ts            # Automatic async-error catcher
│   ├── app.ts              # Express App configurations and factory
│   └── server.ts           # Server runner (Entrypoint)
├── tsconfig.json           # TypeScript Compiler Options
├── drizzle.config.ts       # Drizzle CLI settings
├── package.json            # Scripts and packages manifest
└── .env                    # Active Environment Variables
```

### Detailed Breakdown of Key Files

#### 1. Entry Point files (`server.ts` & `app.ts`)
*   **[server.ts](file:///c:/Users/nikhi/Desktop/Super_50_classwork/Day3/src/server.ts)**: The absolute entry point of your program. It has only one job: boot up. It initializes the database connection, constructs the Express app by calling `createApp()`, starts the HTTP server, and listens for shutdown events (`SIGINT`/`SIGTERM`) to shutdown gracefully.
*   **[app.ts](file:///c:/Users/nikhi/Desktop/Super_50_classwork/Day3/src/app.ts)**: Sets up the Express application shell. It registers security middlewares (`helmet`, `cors`), parsing middlewares (`express.json()`, `cookieParser()`), logging (`morgan`), attaches routes (e.g. `/api/v1/products`), and attaches the global `errorHandler` middleware. We export `createApp` as a factory function so tests can build a fresh application instance in isolation.

#### 2. Configuration files (`src/config/`)
*   **[env.config.ts](file:///c:/Users/nikhi/Desktop/Super_50_classwork/Day3/src/config/env.config.ts)**: Rather than calling `process.env.VARIABLE` everywhere, this file parses `process.env` against a **Zod** schema. If an environment variable is missing or formatted incorrectly, it prints a list of errors and terminates (`process.exit(1)`) immediately on startup.
*   **[database.config.ts](file:///c:/Users/nikhi/Desktop/Super_50_classwork/Day3/src/config/database.config.ts)**: Establishes a database connection pool (`Pool`) via `pg` (node-postgres) and passes it to Drizzle. It also exposes `connectDatabase()`, which tests the connection using a quick query.

#### 3. Middlewares (`src/middleware/`)
*   **[validation.middleware.ts](file:///c:/Users/nikhi/Desktop/Super_50_classwork/Day3/src/middleware/validation.middleware.ts)**: An Express middleware creator. You supply Zod schemas for the request's `body`, `query`, or `params`. The middleware validates the incoming data. If validation fails, it intercepts the request and responds with a standard `400 Bad Request` containing precise field-level errors. If validation succeeds, it mutates `req` with the parsed (transformed) data and passes control to the next handler using `next()`.
*   **[error-handler.middleware.ts](file:///c:/Users/nikhi/Desktop/Super_50_classwork/Day3/src/middleware/error-handler.middleware.ts)**: The safety net of the application. Express knows this is an error handler because it takes 4 arguments. Any error thrown anywhere in the system propagates here. It maps known errors (like `AppError` subclasses or `ZodError` validation issues) to clean JSON responses, and logs them. For unknown errors (like database crashes or runtime bugs), it conceals details from the client to prevent security leaks, sending a generic `500 Internal Server Error`.

#### 4. The Products Module (`src/app/products/`)
This follows the **Controller-Service-Repository** design pattern:
*   **[products.schema.ts](file:///c:/Users/nikhi/Desktop/Super_50_classwork/Day3/src/app/products/products.schema.ts)**: The database schema. Using Drizzle's helpers (`pgTable`, `uuid`, `varchar`, etc.), it defines the exact structure of the `products` table. It also exports the inferred TypeScript types for database queries.
*   **[dto/](file:///c:/Users/nikhi/Desktop/Super_50_classwork/Day3/src/app/products/dto/)**: Data Transfer Objects.
    *   `create-products.dto.ts`: The Zod schema outlining the requirements (e.g. `price` must be a positive number with max 2 decimals) for creating a product.
    *   `update-products.dto.ts`: Built from the create schema using `.partial()` (so all fields are optional), with a check (`.refine()`) ensuring the user sends at least one field to update.
*   **[products.routes.ts](file:///c:/Users/nikhi/Desktop/Super_50_classwork/Day3/src/app/products/products.routes.ts)**: Maps endpoints to specific controller methods. It also registers validation middleware (e.g., checking if the incoming request parameter `:id` is a valid UUID format before executing the controller).
*   **[products.controller.ts](file:///c:/Users/nikhi/Desktop/Super_50_classwork/Day3/src/app/products/products.controller.ts)**: Responsible for the HTTP layer. It extracts data from requests (`req.params`, `req.body`), invokes the service layer functions, and sends back responses using `APISuccessResponse`. It uses the `asyncHandler` wrapper to eliminate `try/catch` blocks.
*   **[products.services.ts](file:///c:/Users/nikhi/Desktop/Super_50_classwork/Day3/src/app/products/products.services.ts)**: The business logic hub. This is where database operations (`db.select()`, `db.insert()`, etc.) occur. It is decoupled from Express (it doesn't accept `req` or `res`), making it highly reusable and testable.

---

## 4. How to Recreate This From Scratch

If you want to start a brand new project like this from scratch, follow these instructions step-by-step:

### Step 1: Initialize Project
Create a directory, open your terminal inside it, and run:
```bash
npm init -y
```

### Step 2: Install Dependencies
Run these commands to install all packages:
```bash
# Production dependencies
npm install express typescript dotenv drizzle-orm pg zod winston helmet cors cookie-parser morgan

# Development dependencies (types, compilers, and ORM kit)
npm install -D typescript @types/node @types/express @types/pg @types/cors @types/cookie-parser @types/morgan nodemon ts-node drizzle-kit
```

### Step 3: Initialize TypeScript
Generate a default `tsconfig.json`:
```bash
npx tsc --init
```
Replace the generated config with the production configurations in this project's [tsconfig.json](file:///c:/Users/nikhi/Desktop/Super_50_classwork/Day3/tsconfig.json) (enabling strict mode and mapping root directories).

### Step 4: Setup Drizzle Config
Create a [drizzle.config.ts](file:///c:/Users/nikhi/Desktop/Super_50_classwork/Day3/drizzle.config.ts) file in the root to map your DB schemas and specify where migrations should be outputted.

### Step 5: Build Outward from Utilities and Configuration
1. Create `src/config/env.config.ts` to parse envs.
2. Create `src/config/database.config.ts` to open connections.
3. Build error handlers (`src/utils/errors/`) and responses (`src/utils/api-response.ts`).
4. Write your global handlers: `validation.middleware.ts` and `error-handler.middleware.ts`.
5. Create your module (e.g. `src/app/products/` or whatever entity you need) following:
   `Schema` ➔ `DTOs` ➔ `Service` ➔ `Controller` ➔ `Routes`.
6. Bind everything in `src/app.ts` and start the engine in `src/server.ts`.

---

## 5. Core Concepts Explained for Beginners

Here are explanations of the advanced topics used in this project, designed so that even a beginner can understand them.

### What is an ORM (Object Relational Mapper)?
Traditionally, to interact with a database, backends had to write SQL queries as raw strings in their code:
```javascript
const query = "SELECT * FROM products WHERE price > " + minPrice;
```
This had severe issues: **SQL injection vulnerability**, **lack of autocomplete**, and **no type checking** (if you mistyped a column name, it crashed at runtime).

An **ORM** lets you define your database structure as programming language classes/objects. **Drizzle ORM** is a TypeScript-first ORM. It lets you write queries using type-safe functions:
```typescript
await db.select().from(products).where(gt(products.price, minPrice));
```
If you mistype a field name, TypeScript highlights it as an error before you run the code! Unlike **Prisma** (which compiles to a heavy Rust binary runner), Drizzle is extremely thin; it is essentially a SQL translator, making it fast and lightweight.

---

### What is a connection pool?
Establishing a database connection requires a handshake (establishing TCP, authenticating, etc.), which takes time and system resources. If you open a new connection for every single incoming HTTP request, your database will quickly crash under load.

A **Connection Pool** maintains a container of open database connections. When an HTTP request comes:
1. It requests a connection from the pool.
2. The pool lends an available, idle connection.
3. The request runs its query, and returns the connection to the pool.
4. The connection remains open and ready for the next request.

This pattern handles high traffic with minimal resource overhead.

---

### Compile-time Type Safety (TypeScript) vs. Runtime Validation (Zod)
A common misunderstanding for beginners is the difference between TypeScript types and Zod schemas:

1. **TypeScript (Compile-Time)**:
   TypeScript is a tool for developers. It compiles your code and detects bugs, but once compiled, **all TypeScript types are deleted**. The running code in production is plain JavaScript.
   If a client sends a request body with a string for `price` instead of a number, TypeScript cannot check this in production!

2. **Zod (Runtime)**:
   Zod is a library that runs **while your application is running**. Zod validates raw inputs (e.g. from the client's HTTP request body) and guarantees it matches the expected structure. Zod allows us to extract TypeScript types automatically:
   ```typescript
   export const CreateProductSchema = z.object({ price: z.number() });
   export type CreateProductDto = z.infer<typeof CreateProductSchema>;
   ```
This provides **both** compile-time code safety for you and runtime validation against user input.

---

### Why use Custom Errors & A Centralized Error Handler?
Without a centralized error handler, you have to write `try-catch` blocks everywhere:
```typescript
// BAD CODE
try {
  const product = await getProduct(id);
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
} catch (e) {
  res.status(500).json({ error: e.message });
}
```
This leads to bloated, hard-to-maintain code.

By creating custom errors like `NotFoundError` and wrapping controllers in `asyncHandler`, we can write clean controllers:
```typescript
// CLEAN CODE
const product = await productService.getProductById(id); // Throws NotFoundError internally if empty
res.json(product);
```
If `NotFoundError` is thrown, the wrapper catches it and forwards it to the global error middleware, which prints a consistent, clean error response.

---

### What is a Graceful Shutdown?
When your server is shut down (e.g., during a deployment update or if you press `Ctrl+C` in your terminal), the operating system sends a **SIGINT** or **SIGTERM** process signal.

*   **Abrupt Shutdown**: The server crashes instantly. In-flight requests (e.g., a customer checking out a cart) are terminated mid-query, corrupting data.
*   **Graceful Shutdown**: The server intercepts the signal, **stops accepting new connections**, waits for in-flight requests to complete database work and send responses, and then terminates.

---

## 6. Testing the API Endpoints

You can test these endpoints using tools like **Postman**, **Bruno**, or directly from your terminal using **cURL**.

### 1. Health Check
```bash
curl -X GET http://localhost:3000/health
```
**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Application is healthy",
  "data": {}
}
```

### 2. Create a Product
```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Developer Mechanical Keyboard", "description": "Hot-swappable tactile keyboard", "price": 89.99, "stock": 50}'
```
**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Developer Mechanical Keyboard",
    "description": "Hot-swappable tactile keyboard",
    "price": "89.99",
    "stock": 50,
    "createdAt": "2026-06-11T07:45:00.000Z",
    "updatedAt": "2026-06-11T07:45:00.000Z"
  }
}
```

### 3. Get All Products
```bash
curl -X GET http://localhost:3000/api/v1/products
```

### 4. Get Product By ID
Replace `<id>` with the UUID returned during creation:
```bash
curl -X GET http://localhost:3000/api/v1/products/<id>
```

### 5. Update a Product (PATCH - Partial Update)
```bash
curl -X PATCH http://localhost:3000/api/v1/products/<id> \
  -H "Content-Type: application/json" \
  -d '{"price": 79.99}'
```

### 6. Delete a Product
```bash
curl -X DELETE http://localhost:3000/api/v1/products/<id>
```
