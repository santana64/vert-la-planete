import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Schema = typeof schema;
type Database = PostgresJsDatabase<Schema>;

const globalForDb = globalThis as unknown as {
  __vlpClient?: ReturnType<typeof postgres>;
  __vlpDb?: Database;
};

function resolveDb(): Database {
  if (globalForDb.__vlpDb) return globalForDb.__vlpDb;

  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Configure it in .env.local (dev) or your host's environment."
    );
  }

  const client = globalForDb.__vlpClient ?? postgres(url, { prepare: false });
  // Reuse the connection across HMR reloads in development.
  if (process.env.NODE_ENV !== "production") globalForDb.__vlpClient = client;

  const database = drizzle(client, { schema });
  globalForDb.__vlpDb = database;
  return database;
}

/**
 * Lazy database handle. The postgres client is created on first query, never at
 * import time — so `next build` (which imports route modules to collect page data)
 * never constructs the client nor validates the connection string. This keeps the
 * build independent of the runtime DATABASE_URL.
 */
export const db = new Proxy({} as Database, {
  get(_target, prop) {
    const database = resolveDb();
    const value = database[prop as keyof Database];
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(database)
      : value;
  }
});

export { schema };
