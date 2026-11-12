import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    tanstackStart({
      // Configure for test environment
      router: {
        routesDirectory: "./src/routes",
        generatedRouteTree: "./src/routeTree.gen.ts",
        disableLogging: true,
      },
    }),
    react(),
  ],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    typecheck: { enabled: true },
    watch: false,
    // Ensure route tree is generated before tests
    globals: true,
  },
});
