import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NodeAdvicePanel } from "./NodeAdvicePanel";

const sampleBundle = {
  id: "test-bundle",
  triggeredAt: "2026-01-01T00:00:00.000Z",
  reason: "测试原因",
  stageId: "work" as const,
  options: [
    {
      id: "a",
      title: "方案 A",
      steps: ["步骤 1"],
      effects: { workload: "down" as const },
      riskNote: "风险说明",
    },
    {
      id: "b",
      title: "方案 B",
      steps: ["步骤 2"],
      effects: { dopamineIndex: "up" as const },
      riskNote: "风险 2",
    },
  ],
};

describe("NodeAdvicePanel", () => {
  it("shows empty state when no bundle", () => {
    render(
      <NodeAdvicePanel
        primary={null}
        urgent={null}
        milestone={null}
        onFeedback={vi.fn()}
        age={28}
      />
    );
    expect(screen.getByText(/当前暂无方案/)).toBeInTheDocument();
  });

  it("calls onFeedback when helpful clicked", () => {
    const onFeedback = vi.fn();
    render(
      <NodeAdvicePanel
        primary={sampleBundle}
        urgent={null}
        milestone={sampleBundle}
        onFeedback={onFeedback}
        age={28}
      />
    );
    fireEvent.click(screen.getAllByRole("button", { name: "有帮助" })[0]!);
    expect(onFeedback).toHaveBeenCalledWith({
      bundleId: "test-bundle",
      optionId: "a",
      helpful: true,
    });
  });
});
