/**
 * SERVER
 *
 * Starts the Express server on the configured PORT.
 * Separated from app.js to allow:
 * - Easier testing (import app without starting server)
 * - Clean separation of app configuration and server startup
 */
import app from "./app.js";

// Read PORT from environment variables, default to 8080
const PORT = process.env.PORT || 8080;

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
