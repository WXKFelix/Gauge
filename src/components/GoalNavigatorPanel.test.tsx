import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createPlanFromOption } from "../goal-navigator";
import type { NodeAdviceOption } from "../life-advice-types";
import { GoalNavigatorPanel } from "./GoalNavigatorPanel";

const option: NodeAdviceOption = {
  id: "opt",
  title: "测试方案",
  steps: ["今日一步", "本周二步"],
  effects: {},
  riskNote: "",
  tier: "optimal",
};

describe("GoalNavigatorPanel", () => {
  it("shows empty state without plan", () => {
    render(<GoalNavigatorPanel plan={null} onPlanChange={() => {}} />);
    expect(screen.getByText(/目标领航/)).toBeInTheDocument();
    expect(screen.getByText(/纳入领航/)).toBeInTheDocument();
  });

  it("toggles task completion", () => {
    const plan = createPlanFromOption("b", "节点", option);
    const onPlanChange = vi.fn();
    render(<GoalNavigatorPanel plan={plan} onPlanChange={onPlanChange} />);
    fireEvent.click(screen.getByLabelText("今日一步"));
    expect(onPlanChange).toHaveBeenCalled();
  });
});
