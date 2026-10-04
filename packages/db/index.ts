import { parseEnv } from "@coffeeExp/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";

try {
  loadEnvFile(fileURLToPath(new URL("../../.env", import.meta.url)));
} catch (error) {
  console.warn("Could not load .env file:", error);
}

const env = parseEnv(process.env);

export const db = drizzle(env.DATABASE_URL);
