import { parseEnv } from "@coffeeExp/env";
import { drizzle } from "drizzle-orm/node-postgres";

const env = parseEnv(process.env);

export const db = drizzle(env.DATABASE_URL);
