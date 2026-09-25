import type { NodeAdviceBundle } from "../life-advice-types";

export interface HomeNodeTeaserProps {
  bundle: NodeAdviceBundle | null;
  navigatorProgress?: number | null;
  onOpenNodes: () => void;
  onOpenNavigator?: () => void;
}

export function HomeNodeTeaser({
  bundle,
  navigatorProgress,
  onOpenNodes,
  onOpenNavigator,
}: HomeNodeTeaserProps) {
  if (!bundle) return null;
  const optimal = bundle.options.find((o) => o.tier === "optimal") ?? bundle.options[0];
  if (!optimal) return null;

  return (
    <section className="node-teaser" aria-labelledby="node-teaser-h">
      <div className="node-teaser-head">
        <h2 id="node-teaser-h">当前关键节点</h2>
        <span className="node-teaser-badge">最优解</span>
      </div>
      {bundle.nodeLabel ? (
        <p className="node-teaser-node">{bundle.nodeLabel}</p>
      ) : null}
      <p className="node-teaser-reason">{bundle.reason}</p>
      <p className="node-teaser-optimal-title">{optimal.title}</p>
      {navigatorProgress != null ? (
        <p className="node-teaser-nav-progress">
          领航执行 <strong>{navigatorProgress}%</strong>
        </p>
      ) : null}
      <div className="node-teaser-actions">
        {onOpenNavigator ? (
          <button
            type="button"
            className="btn-primary btn-block"
            onClick={onOpenNavigator}
          >
            {navigatorProgress != null ? "继续领航" : "打开领航"}
          </button>
        ) : null}
        <button type="button" className="btn-secondary btn-block" onClick={onOpenNodes}>
          节点方案
        </button>
      </div>
    </section>
  );
}
