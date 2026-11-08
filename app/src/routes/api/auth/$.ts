import { authServer } from "@coffeeExp/auth/server";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        return await authServer.handler(request);
      },
      POST: async ({ request }: { request: Request }) => {
        return await authServer.handler(request);
      },
    },
  },
});
