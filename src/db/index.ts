import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Fallback keeps module import side-effect-free so `next build` succeeds without a
// configured DB; postgres-js connects lazily, so a real query still needs DATABASE_URL.
const databaseUrl =
  process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/vert_la_planete";

// Reuse a single connection across HMR reloads in development.
const globalForDb = globalThis as unknown as {
  __vlpClient?: ReturnType<typeof postgres>;
};

const client = globalForDb.__vlpClient ?? postgres(databaseUrl, { prepare: false });
if (process.env.NODE_ENV !== "production") globalForDb.__vlpClient = client;

export const db = drizzle(client, { schema });
export { schema };
