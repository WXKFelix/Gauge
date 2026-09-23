import {
  getActiveKeyNode,
  getUpcomingKeyNode,
  LIFE_KEY_NODES,
} from "../life-key-nodes";

export interface KeyNodeTimelineProps {
  age: number;
}

export function KeyNodeTimeline({ age }: KeyNodeTimelineProps) {
  const active = getActiveKeyNode(age);
  const upcoming = getUpcomingKeyNode(age);

  return (
    <section className="key-node-timeline" aria-labelledby="key-node-timeline-h">
      <h3 id="key-node-timeline-h">人生关键节点</h3>
      <p className="key-node-timeline-lede">
        在年龄窗口内给出<strong>当前条件下的推荐最优解</strong>，并附备选路径。
      </p>
      <ol className="key-node-list">
        {LIFE_KEY_NODES.map((node) => {
          const isActive = active?.id === node.id;
          const isPast = age > node.ageMax;
          return (
            <li
              key={node.id}
              className={`key-node-item${
                isActive ? " key-node-item--active" : ""
              }${isPast ? " key-node-item--past" : ""}`}
            >
              <span className="key-node-age">
                {node.ageMin}–{node.ageMax} 岁
              </span>
              <span className="key-node-label">{node.label}</span>
              <span className="key-node-tag">{node.tagline}</span>
              {isActive ? (
                <span className="key-node-badge">当前窗口</span>
              ) : null}
            </li>
          );
        })}
      </ol>
      {upcoming && !active ? (
        <p className="key-node-upcoming">
          下一窗口：<strong>{upcoming.label}</strong>（约 {upcoming.ageMin}{" "}
          岁起）
        </p>
      ) : null}
    </section>
  );
}
