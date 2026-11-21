import { getSession } from "#/auth/auth.functions";
import { describe, expect, it, vi } from "vitest";
import { renderWithFileRoutes } from "../../test/route-utils";
import { screen, waitFor } from "../../test/utils";

vi.mock("#/auth/auth.functions", () => ({
  getSession: vi.fn<() => Promise<void>>(),
}));

describe("Home Route", () => {
  it("redirects unauthenticated users back to '/'", async () => {
    vi.mocked(getSession).mockResolvedValueOnce(null);

    const { router } = renderWithFileRoutes({
      initialLocation: "/home",
    });

    waitFor(() => {
      expect(router.state.location.pathname).toBe("/");
      expect(screen.getByText("Hello \"/home\"")).toBeNull();
    });

    expect(await screen.findByText("Continue with Google")).toBeInTheDocument();
  });
});
