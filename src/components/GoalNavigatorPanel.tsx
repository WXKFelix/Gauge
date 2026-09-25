import type { NavigatorPlan } from "../goal-navigator";
import {
  confidenceLabel,
  planProgressPercent,
  tasksForHorizon,
  toggleNavigatorTask,
} from "../goal-navigator";

export interface GoalNavigatorPanelProps {
  plan: NavigatorPlan | null;
  onPlanChange: (plan: NavigatorPlan | null) => void;
  onOpenNodes?: () => void;
}

function TaskList({
  plan,
  horizon,
  onToggle,
}: {
  plan: NavigatorPlan;
  horizon: "today" | "week";
  onToggle: (taskId: string) => void;
}) {
  const tasks = tasksForHorizon(plan, horizon);
  if (tasks.length === 0) return null;
  const title = horizon === "today" ? "今日焦点" : "本周步骤";

  return (
    <div className="navigator-block">
      <h3 className="navigator-block-title">{title}</h3>
      <ul className="navigator-tasks">
        {tasks.map((task) => (
          <li key={task.id}>
            <label className="navigator-task">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggle(task.id)}
              />
              <span
                className={
                  task.completed ? "navigator-task-label--done" : undefined
                }
              >
                {task.label}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function GoalNavigatorPanel({
  plan,
  onPlanChange,
  onOpenNodes,
}: GoalNavigatorPanelProps) {
  if (!plan) {
    return (
      <section className="navigator-panel" aria-labelledby="navigator-heading">
        <h2 id="navigator-heading">目标领航</h2>
        <p className="navigator-lede">
          系统年龄节点为默认人生蓝图。在「节点」页对推荐最优解点「纳入领航」，这里会出现今日与本周行动。
        </p>
        {onOpenNodes ? (
          <button type="button" className="btn-secondary" onClick={onOpenNodes}>
            前往节点
          </button>
        ) : null}
      </section>
    );
  }

  const progress = planProgressPercent(plan);

  const toggle = (taskId: string) => {
    onPlanChange(toggleNavigatorTask(plan, taskId));
  };

  return (
    <section className="navigator-panel" aria-labelledby="navigator-heading">
      <h2 id="navigator-heading">目标领航</h2>
      {plan.nodeLabel ? (
        <p className="navigator-node">{plan.nodeLabel}</p>
      ) : null}
      <p className="navigator-plan-title">{plan.title}</p>

      <div className="navigator-progress" aria-label={`执行进度 ${progress}%`}>
        <div className="navigator-progress-bar">
          <div
            className="navigator-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="navigator-progress-meta">
          执行进度 <strong>{progress}%</strong> · 节点置信度{" "}
          <strong>{confidenceLabel(progress)}</strong>
        </p>
      </div>

      <TaskList plan={plan} horizon="today" onToggle={toggle} />
      <TaskList plan={plan} horizon="week" onToggle={toggle} />

      <button
        type="button"
        className="btn-ghost navigator-clear"
        onClick={() => onPlanChange(null)}
      >
        结束本轮领航
      </button>
    </section>
  );
}
