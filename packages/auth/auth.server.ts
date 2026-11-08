import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@coffeeExp/db";
import { schema } from "@coffeeExp/db";
import { parseEnv } from "@coffeeExp/env";
import { betterAuth } from "better-auth";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";

try {
  loadEnvFile(fileURLToPath(new URL("../../.env", import.meta.url)));
} catch (error) {
  console.warn("Could not load .env file:", error);
}

const env = parseEnv(process.env);

export const authServer = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
});
