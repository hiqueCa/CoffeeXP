import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  /**
   * As by documentation, Tanstack vite plugin needs to come before react():
   * https://tanstack.com/router/latest/docs/installation/with-vite
   */
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      quoteStyle: "double",
    }),
    react(),
  ],
  server: {
    port: 3000,
  },
});
