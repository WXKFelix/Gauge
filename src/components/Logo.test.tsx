import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo } from "./Logo";

describe("Logo", () => {
  it("renders wordmark when requested", () => {
    render(<Logo showWordmark />);
    expect(screen.getByText("BEARING")).toBeInTheDocument();
    expect(screen.queryByText(/Quantified Life/i)).not.toBeInTheDocument();
  });
});
