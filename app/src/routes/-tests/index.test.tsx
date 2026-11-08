import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("IndexPage", () => {
  it("renders the page correctly", () => {
    render();
    expect(screen.getByText(/Your morning cup, remembered./i)).toBeInTheDocument();
  });
});
