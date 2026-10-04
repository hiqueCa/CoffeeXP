import { authServer } from "@coffeeExp/auth";
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
