import { getSession } from "#/auth/auth.functions";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/home")({
  beforeLoad: async () => {
    const session = await getSession();

    if (!session) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: HomePage,
});

function HomePage() {
  return <div>Hello "/home"!</div>;
}
