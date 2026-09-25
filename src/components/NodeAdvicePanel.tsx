import type { NodeAdviceBundle, NodeAdviceOption } from "../life-advice-types";
import type { AdvisorFeedback } from "../life-journey";
import { KeyNodeTimeline } from "./KeyNodeTimeline";

const EFFECT_LABEL: Record<string, string> = {
  up: "↑",
  down: "↓",
  neutral: "→",
};

const METRIC_LABEL: Record<string, string> = {
  workload: "工作量",
  dopamineIndex: "多巴胺",
  assets: "资产",
  wardrobeUtilization: "生活利用",
  outfitSatisfaction: "穿搭满意",
};

function AdviceBlock({
  bundle,
  onFeedback,
  onActivatePlan,
  heading,
}: {
  bundle: NodeAdviceBundle;
  onFeedback: (feedback: Omit<AdvisorFeedback, "at">) => void;
  onActivatePlan?: (option: NodeAdviceOption) => void;
  heading?: string;
}) {
  return (
    <div className="advice-block">
      {heading ? <h3 className="advice-block-title">{heading}</h3> : null}
      {bundle.nodeLabel ? (
        <p className="advisor-node-label">{bundle.nodeLabel}</p>
      ) : null}
      <p className="advisor-reason">{bundle.reason}</p>
      <ul className="advisor-options">
        {bundle.options.map((opt) => (
          <li
            key={opt.id}
            className={`advisor-card${
              opt.tier === "optimal" ? " advisor-card--optimal" : ""
            }`}
          >
            {opt.tier === "optimal" ? (
              <span className="advisor-optimal-badge">推荐最优解</span>
            ) : null}
            <h4 className="advisor-card-title">{opt.title}</h4>
            <ol>
              {opt.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
            <dl className="advisor-effects">
              {Object.entries(opt.effects).map(([key, effect]) => (
                <div key={key}>
                  <dt>{METRIC_LABEL[key] ?? key}</dt>
                  <dd aria-label={`${METRIC_LABEL[key] ?? key} ${effect}`}>
                    {EFFECT_LABEL[effect ?? "neutral"]}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="advisor-risk">{opt.riskNote}</p>
            <div className="advisor-card-actions">
              {opt.tier === "optimal" && onActivatePlan ? (
                <button
                  type="button"
                  className="btn-primary advisor-activate"
                  onClick={() => onActivatePlan(opt)}
                >
                  纳入领航
                </button>
              ) : null}
              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  onFeedback({
                    bundleId: bundle.id,
                    optionId: opt.id,
                    helpful: true,
                  })
                }
              >
                有帮助
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() =>
                  onFeedback({
                    bundleId: bundle.id,
                    optionId: opt.id,
                    helpful: false,
                  })
                }
              >
                暂不采纳
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export interface NodeAdvicePanelProps {
  primary: NodeAdviceBundle | null;
  milestone: NodeAdviceBundle | null;
  urgent: NodeAdviceBundle | null;
  onFeedback: (feedback: Omit<AdvisorFeedback, "at">) => void;
  onActivatePlan?: (bundle: NodeAdviceBundle, option: NodeAdviceOption) => void;
  age: number;
}

export function NodeAdvicePanel({
  primary,
  milestone,
  urgent,
  onFeedback,
  onActivatePlan,
  age,
}: NodeAdvicePanelProps) {
  const handleActivate = onActivatePlan
    ? (option: NodeAdviceOption) => {
        if (primary) onActivatePlan(primary, option);
      }
    : undefined;
  const showMilestoneAlso =
    urgent != null &&
    milestone != null &&
    urgent.id !== milestone.id;

  return (
    <section className="advisor-panel" aria-labelledby="advisor-heading">
      <h2 id="advisor-heading">关键节点 · 最优解</h2>
      <KeyNodeTimeline age={age} />
      {!primary ? (
        <p className="advisor-empty" role="status">
          当前暂无方案。请在「指标」调节年龄或自评滑块；换城类节点需添加计划坐标。
        </p>
      ) : (
        <>
          <AdviceBlock
            bundle={primary}
            onFeedback={onFeedback}
            onActivatePlan={handleActivate}
            heading={urgent ? "优先 · 状态预警最优解" : "当前窗口 · 人生节点最优解"}
          />
          {showMilestoneAlso && milestone ? (
            <AdviceBlock
              bundle={milestone}
              onFeedback={onFeedback}
              onActivatePlan={
                onActivatePlan
                  ? (option) => onActivatePlan(milestone, option)
                  : undefined
              }
              heading="并行参考 · 年龄关键节点"
            />
          ) : null}
          <p className="advisor-disclaimer">
            「最优解」为当前数据下的推荐路径，非唯一标准答案；不替代专业心理、医疗或财务建议。
          </p>
        </>
      )}
    </section>
  );
}
