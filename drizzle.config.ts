import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
import { resolve } from "path";

// Load env from apps/extensions/.env.local
config({ path: resolve(process.cwd(), "apps/extensions/.env.local") });

export default defineConfig({
  schema: "./packages/app-core/src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
