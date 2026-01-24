import { defineConfig } from "drizzle-kit";

if (!process.env.DB_URL) {
  throw new Error("DB_URL is not set");
}

export default defineConfig({
  schema: "src/infrastructure/database/schema.ts",
  out: "src/infrastructure/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_URL,
  },
});