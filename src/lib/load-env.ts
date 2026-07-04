/**
 * Loads environment variables for CLI tooling (drizzle-kit, seed scripts) that run
 * outside of Next.js' automatic .env loading. Next.js itself loads these in the app.
 * Precedence: .env.local overrides .env.
 */
import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });
