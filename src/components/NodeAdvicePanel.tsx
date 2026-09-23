import type { AdvisorFeedback, NodeAdviceBundle } from "../life-journey";

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
}

export function NodeAdvicePanel({ bundle, onFeedback }: NodeAdvicePanelProps) {
  if (!bundle) {
    return (
      <section className="advisor-panel" aria-labelledby="advisor-heading">
        <h2 id="advisor-heading">关键节点</h2>
        <p className="advisor-empty" role="status">
          暂无新建议。当你关心的指标或人生阶段需要行动参考时，这里会出现 2–3
          条对你可能有帮助的路径——采纳与否由你决定。
        </p>
      </section>
    );
  }

  return (
    <section className="advisor-panel" aria-labelledby="advisor-heading">
      <h2 id="advisor-heading">关键节点</h2>
      <p className="advisor-reason">{bundle.reason}</p>
      <ul className="advisor-options">
        {bundle.options.map((opt) => (
          <li key={opt.id} className="advisor-card">
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
        以上为透明规则生成的参考方案，不替代专业心理、医疗或财务建议。
      </p>
    </section>
  );
}
