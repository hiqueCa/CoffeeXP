import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IndexPage } from ".";

describe("IndexPage", () => {
  it("renders the page correctly", () => {
    render(<IndexPage />);
    expect(screen.getByText(/Your morning cup, remembered./i)).toBeInTheDocument();
  });
});
