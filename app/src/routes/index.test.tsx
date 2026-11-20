import { authClient } from "@coffeeExp/auth/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithFileRoutes } from "../../test/route-utils";
import { screen } from "../../test/utils";

vi.mock("@coffeeExp/auth/client", () => ({
  authClient: {
    signIn: {
      social: vi.fn<() => void>(),
    },
  },
}));

beforeEach(() => {
  vi.clearAllMocks();

  renderWithFileRoutes({
    initialLocation: "/",
  });
});

describe("Index Route", () => {
  it("renders the index route correctly", async () => {
    expect(await screen.findByText("CoffeeXP")).toBeInTheDocument();
  });

  it("calls the authClient when the login button is clicked", async () => {
    const loginButton = await screen.findByRole("button", { name: /Continue with Google/i });
    loginButton.click();

    expect(authClient.signIn.social).toHaveBeenCalled();
  });

  it("calls the social provider sign-in with the correct callback url", async () => {
    const loginButton = await screen.findByRole("button", { name: /Continue with Google/i });
    loginButton.click();

    expect(authClient.signIn.social).toHaveBeenCalledWith({
      provider: "google",
      callbackURL: "/home",
    });
  });
});
