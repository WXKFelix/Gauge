import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DEFAULT_JOURNEY } from "../life-journey";
import { JourneyStrip } from "./JourneyStrip";

describe("JourneyStrip", () => {
  it("renders birth point label", () => {
    render(
      <JourneyStrip journey={DEFAULT_JOURNEY} onJourneyChange={vi.fn()} />
    );
    expect(screen.getByText(/A · 出生地与成长/)).toBeInTheDocument();
  });

  it("adds point on button click", () => {
    const onChange = vi.fn();
    render(
      <JourneyStrip journey={DEFAULT_JOURNEY} onJourneyChange={onChange} />
    );
    fireEvent.change(screen.getByPlaceholderText("添加 B/D 点名称…"), {
      target: { value: "D · 测试" },
    });
    fireEvent.click(screen.getByRole("button", { name: "添加坐标" }));
    expect(onChange).toHaveBeenCalled();
  });
});
