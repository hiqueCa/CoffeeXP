import { authClient } from "@coffeeExp/auth/client";
import { describe, expect, it, vi } from "vitest";
import { renderWithFileRoutes } from "../../test/route-utils";
import { screen } from "../../test/utils";

vi.mock("@coffeeExp/auth/client", () => ({
  authClient: {
    signIn: {
      social: vi.fn<() => void>(),
    },
  },
}));

describe("Index Route", () => {
  it("renders the index route correctly", async () => {
    renderWithFileRoutes({
      initialLocation: "/",
    });

    expect(await screen.findByText("CoffeeXP")).toBeInTheDocument();
  });

  it("calls the authClient when the login button is clicked", async () => {
    renderWithFileRoutes({
      initialLocation: "/",
    });

    const loginButton = await screen.findByRole("button", { name: /Continue with Google/i });
    loginButton.click();

    expect(authClient.signIn.social).toHaveBeenCalled();
  });
});
