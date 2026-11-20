import { defineProject } from "vitest/config";

export default defineProject({
  test: {
    name: "coffeeExp/env",
    typecheck: { enabled: true },
  },
});
