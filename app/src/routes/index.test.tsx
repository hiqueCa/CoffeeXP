import { describe, expect, it } from "vitest";
import { renderWithFileRoutes } from "../../test/route-utils";
import { screen } from "../../test/utils";

describe("Index Route", () => {
  it("renders the index route correctly", async () => {
    renderWithFileRoutes({
      initialLocation: "/",
    });

    expect(await screen.findByText("CoffeeXP")).toBeInTheDocument();
  });
});
