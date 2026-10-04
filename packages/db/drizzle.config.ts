import { parseEnv } from "@coffeeExp/env";
import { defineConfig } from "drizzle-kit";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";

try {
  loadEnvFile(fileURLToPath(new URL("../../.env", import.meta.url)));
} catch (error) {
  console.warn("Could not load .env file:", error);
}

const env = parseEnv(process.env);

export default defineConfig({
  out: "./drizzle",
  schema: "./schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
