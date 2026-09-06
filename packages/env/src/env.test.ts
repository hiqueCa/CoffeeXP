import { describe, expect, it, vi } from "vitest";
import { parseEnv } from "./env.ts";

vi.stubEnv("DATABASE_URL", "https://example.com/database");
vi.stubEnv("BETTER_AUTH_URL", "https://example.com/auth");
vi.stubEnv("BETTER_AUTH_SECRET", "abcdefghijklmnopqrstuvwxyz123456");

describe("parseEnv", () => {
  it("parses environment variables correctly", () => {
    const parsedEnv = parseEnv(process.env);

    expect(parsedEnv.DATABASE_URL).toBe("https://example.com/database");
    expect(parsedEnv.BETTER_AUTH_URL).toBe("https://example.com/auth");
    expect(parsedEnv.BETTER_AUTH_SECRET).toBe("abcdefghijklmnopqrstuvwxyz123456");
  });

  it("throws an error for invalid environment variables", () => {
    vi.stubEnv("DATABASE_URL", "invalid-url");
    vi.stubEnv("BETTER_AUTH_URL", "invalid-url");
    vi.stubEnv("BETTER_AUTH_SECRET", "short");

    expect(() => parseEnv(process.env)).toThrow(expect.any(Error));
  });
});
