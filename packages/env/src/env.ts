import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.url(),
  BETTER_AUTH_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().min(32),
});

export function parseEnv(env: NodeJS.ProcessEnv) {
  const safeParseResult = envSchema.safeParse(env);

  if (!safeParseResult.success) {
    const errorMessages = safeParseResult.error.issues.map(
      (issue) => `${String(issue.path[0])} ${issue.message}`,
    );
    throw new Error(errorMessages.join(", "));
  }

  return safeParseResult.data;
}
