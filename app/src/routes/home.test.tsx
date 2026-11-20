import { describe, expect, it } from "vitest";
import { renderWithFileRoutes } from "../../test/route-utils";
import { screen } from "../../test/utils";

describe("Home Route", () => {
  it("renders the home route correctly", async () => {
    renderWithFileRoutes({
      initialLocation: "/home",
    });

    expect(await screen.findByText("Hello \"/home\"!")).toBeInTheDocument();
  });
});
