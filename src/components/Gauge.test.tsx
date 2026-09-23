import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Gauge } from "./Gauge";

describe("<Gauge />", () => {
  it("renders the label", () => {
    render(<Gauge label="CPU Load" value={42} unit="%" />);
    expect(screen.getByText("CPU Load")).toBeInTheDocument();
  });

  it("renders the rounded value with its unit", () => {
    render(<Gauge label="CPU Load" value={42.6} unit="%" />);
    expect(screen.getByText(/43%/)).toBeInTheDocument();
  });

  it("clamps values above the maximum", () => {
    render(<Gauge label="Memory" value={250} min={0} max={100} unit="%" />);
    expect(screen.getByText(/100%/)).toBeInTheDocument();
  });

  it("exposes an accessible image role with a description", () => {
    render(<Gauge label="Network" value={18} unit="MB/s" />);
    expect(
      screen.getByRole("img", { name: /Network: 18MB\/s/ })
    ).toBeInTheDocument();
  });
});
