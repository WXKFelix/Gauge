import type { NodeAdviceBundle } from "../life-advice-types";

export interface HomeNodeTeaserProps {
  bundle: NodeAdviceBundle | null;
  onOpenNodes: () => void;
}

export function HomeNodeTeaser({ bundle, onOpenNodes }: HomeNodeTeaserProps) {
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
      <button type="button" className="btn-secondary btn-block" onClick={onOpenNodes}>
        查看完整方案与备选路径
      </button>
    </section>
  );
}
