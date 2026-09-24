import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LoginPage } from "./LoginPage";

describe("LoginPage", () => {
  it("calls onLogin after submit", () => {
    vi.useFakeTimers();
    const onLogin = vi.fn();
    render(<LoginPage onLogin={onLogin} />);
    fireEvent.change(screen.getByPlaceholderText("昵称或姓名"), {
      target: { value: "小明" },
    });
    fireEvent.click(screen.getByRole("button", { name: "进入 Gauge" }));
    vi.advanceTimersByTime(600);
    expect(onLogin).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
