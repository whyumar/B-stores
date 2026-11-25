import { betterAuth } from "better-auth";
import { Pool } from "pg";

const globalForAuth = globalThis as typeof globalThis & {
  bStoresAuthPool?: Pool;
};

if (!process.env.DATABASE_URL && process.env.NODE_ENV === "production") {
  console.warn("DATABASE_URL is not configured. Better Auth endpoints will be unavailable.");
}

const pool =
  globalForAuth.bStoresAuthPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000
  });

if (process.env.NODE_ENV !== "production") {
  globalForAuth.bStoresAuthPool = pool;
}

const trustedOrigins = [
  process.env.BETTER_AUTH_URL,
  process.env.NEXT_PUBLIC_SITE_URL
].filter((origin): origin is string => Boolean(origin));

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET || "b-stores-build-only-secret-do-not-use-in-production",
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL,
  trustedOrigins,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production"
  }
});
