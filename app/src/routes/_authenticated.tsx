import { getSession } from "#/auth/auth.functions";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    const session = await getSession();

    if (!session) {
      throw redirect({
        to: "/",
      });
    }
  },

  component: () => <Outlet />,
});
