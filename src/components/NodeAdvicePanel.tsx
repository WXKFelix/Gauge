import type { NodeAdviceBundle } from "../life-advice-types";
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

export interface NodeAdvicePanelProps {
  bundle: NodeAdviceBundle | null;
  onFeedback: (feedback: Omit<AdvisorFeedback, "at">) => void;
  age: number;
}

export function NodeAdvicePanel({ bundle, onFeedback, age }: NodeAdvicePanelProps) {
  return (
    <section className="advisor-panel" aria-labelledby="advisor-heading">
      <h2 id="advisor-heading">关键节点 · 最优解</h2>
      <KeyNodeTimeline age={age} />
      {!bundle ? (
        <p className="advisor-empty" role="status">
          当前年龄窗口暂无匹配方案。可调整年龄或添加「计划坐标」以触发换城类节点；若工作量长期偏高，也会优先给出紧急最优解。
        </p>
      ) : (
        <>
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
            <h3>{opt.title}</h3>
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
      <p className="advisor-disclaimer">
        「最优解」指在当前年龄、阶段与自评数据下的推荐路径，仍非唯一标准答案；不替代专业心理、医疗或财务建议。
      </p>
        </>
      )}
    </section>
  );
}
