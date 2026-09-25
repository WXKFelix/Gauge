import type { NodeAdviceOption } from "./life-advice-types";

export type NavigatorHorizon = "today" | "week";

export interface NavigatorTask {
  id: string;
  label: string;
  horizon: NavigatorHorizon;
  completed: boolean;
  completedAt?: string;
}

/** Active execution plan derived from a node optimal solution (module 2). */
export interface NavigatorPlan {
  sourceBundleId: string;
  sourceOptionId: string;
  nodeLabel?: string;
  title: string;
  activatedAt: string;
  tasks: NavigatorTask[];
}

export function createPlanFromOption(
  bundleId: string,
  nodeLabel: string | undefined,
  option: NodeAdviceOption
): NavigatorPlan {
  const tasks: NavigatorTask[] = option.steps.map((step, index) => ({
    id: `${option.id}-step-${index}`,
    label: step,
    horizon: index === 0 ? "today" : "week",
    completed: false,
  }));

  return {
    sourceBundleId: bundleId,
    sourceOptionId: option.id,
    nodeLabel,
    title: option.title,
    activatedAt: new Date().toISOString(),
    tasks,
  };
}

export function planProgressPercent(plan: NavigatorPlan): number {
  if (plan.tasks.length === 0) return 0;
  const done = plan.tasks.filter((t) => t.completed).length;
  return Math.round((done / plan.tasks.length) * 100);
}

export function confidenceLabel(progressPercent: number): string {
  if (progressPercent >= 80) return "高";
  if (progressPercent >= 40) return "中";
  return "待加强";
}

export function toggleNavigatorTask(
  plan: NavigatorPlan,
  taskId: string
): NavigatorPlan {
  return {
    ...plan,
    tasks: plan.tasks.map((task) => {
      if (task.id !== taskId) return task;
      const completed = !task.completed;
      return {
        ...task,
        completed,
        completedAt: completed ? new Date().toISOString() : undefined,
      };
    }),
  };
}

export function tasksForHorizon(
  plan: NavigatorPlan,
  horizon: NavigatorHorizon
): NavigatorTask[] {
  return plan.tasks.filter((t) => t.horizon === horizon);
}
