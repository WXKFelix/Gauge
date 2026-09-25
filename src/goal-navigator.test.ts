import { describe, expect, it } from "vitest";
import {
  confidenceLabel,
  createPlanFromOption,
  planProgressPercent,
  toggleNavigatorTask,
} from "./goal-navigator";
import type { NodeAdviceOption } from "./life-advice-types";

const sampleOption: NodeAdviceOption = {
  id: "opt-a",
  title: "边界实验",
  steps: ["今日写下一条边界", "本周拒绝一次低价值请求", "周末复盘精力"],
  effects: { workload: "down" },
  riskNote: "示意",
  tier: "optimal",
};

describe("goal-navigator", () => {
  it("maps first step to today and rest to week", () => {
    const plan = createPlanFromOption("bundle-1", "30 岁复盘", sampleOption);
    expect(plan.tasks[0].horizon).toBe("today");
    expect(plan.tasks[1].horizon).toBe("week");
    expect(plan.nodeLabel).toBe("30 岁复盘");
  });

  it("computes progress and toggles tasks", () => {
    let plan = createPlanFromOption("b", undefined, sampleOption);
    expect(planProgressPercent(plan)).toBe(0);
    plan = toggleNavigatorTask(plan, plan.tasks[0].id);
    expect(planProgressPercent(plan)).toBe(33);
    expect(confidenceLabel(33)).toBe("待加强");
  });
});
