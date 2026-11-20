import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineProject } from "vitest/config";

export default defineProject({
  plugins: [
    tanstackStart({
      srcDirectory: "./src",
      router: {
        routesDirectory: "./routes",
        generatedRouteTree: "./routeTree.gen.ts",
        disableLogging: true,
      },
    }),
    react(),
  ],
  test: {
    name: "app",
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    typecheck: { enabled: true },
  },
});
