import { authWithCallbackTo } from "@coffeeExp/auth/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithFileRoutes } from "../../test/route-utils";
import { screen } from "../../test/utils";

vi.mock("@coffeeExp/auth/client", () => ({
  authWithCallbackTo: vi.fn<() => void>(),
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

  it("triggers a callback to the /home route", async () => {
    const loginButton = await screen.findByRole("button", { name: /Continue with Google/i });
    loginButton.click();

    expect(authWithCallbackTo).toHaveBeenCalledWith("/home");
  });
});
