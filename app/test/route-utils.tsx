import { routeTree } from "#/routeTree.gen";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { type RenderOptions } from "@testing-library/react";
import { render } from "./utils";

interface RenderWithFileRoutesOptions extends Omit<RenderOptions, "wrapper"> {
  initialLocation?: string;
  routerContext?: any;
}

export function renderWithFileRoutes(
  {
    initialLocation = "/",
    routerContext = {},
    ...renderOptions
  }: RenderWithFileRoutesOptions = {},
) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: [initialLocation],
    }),
    context: routerContext,
  });

  return {
    ...render(<RouterProvider router={router} />, { ...renderOptions }),
    router,
  };
}
