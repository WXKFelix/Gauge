import { useMemo, useState } from "react";
import {
  addVisitedPoint,
  sortJourneyPoints,
  type LifeJourneyState,
  type LifePoint,
} from "../life-journey";

export interface JourneyStripProps {
  journey: LifeJourneyState;
  onJourneyChange: (next: LifeJourneyState) => void;
}

function pointKindLabel(kind: LifePoint["kind"]): string {
  switch (kind) {
    case "birth":
      return "A · 出生";
    case "visited":
      return "已到访";
    case "planned":
      return "计划中";
  }
}

export function JourneyStrip({ journey, onJourneyChange }: JourneyStripProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draftLabel, setDraftLabel] = useState("");

  const ordered = useMemo(
    () => sortJourneyPoints(journey.points),
    [journey.points]
  );

  const selected = ordered.find((p) => p.id === selectedId) ?? null;

  const handleAdd = () => {
    onJourneyChange(addVisitedPoint(journey, draftLabel));
    setDraftLabel("");
  };

  const toggleMostlyAtBirth = () => {
    onJourneyChange({
      ...journey,
      mostlyAtBirth: !journey.mostlyAtBirth,
      points:
        !journey.mostlyAtBirth && journey.points.length > 1
          ? [journey.points.find((p) => p.kind === "birth") ?? journey.points[0]!]
          : journey.points,
    });
  };

  return (
    <section className="journey-panel" aria-labelledby="journey-heading">
      <h2 id="journey-heading">人生坐标</h2>
      <p className="journey-lede">
        地图记录<strong>对你有意义</strong>的地方：A 是起点，B、C、D 是你在意的经历与选择。
        一生只在 A 附近同样值得被看见。
      </p>

      {journey.mostlyAtBirth && ordered.length <= 1 ? (
        <div className="journey-empty" role="status">
          <span className="journey-empty-icon" aria-hidden>
            🌍
          </span>
          <p>一生在 A，也是完整轨迹。下方可标记「主要在 A」或添加 B 点。</p>
        </div>
      ) : null}

      <div
        className="journey-strip journey-strip--scroll"
        role="list"
        aria-label="人生坐标轨迹"
      >
        {ordered.map((point, index) => (
          <div className="journey-strip-item" role="listitem" key={point.id}>
            {index > 0 ? (
              <span
                className={`journey-connector${
                  point.kind === "planned" ? " journey-connector--dashed" : ""
                }`}
                aria-hidden
              />
            ) : null}
            <button
              type="button"
              className={`journey-pin journey-pin--${point.kind}${
                selectedId === point.id ? " journey-pin--selected" : ""
              }`}
              onClick={() =>
                setSelectedId((id) => (id === point.id ? null : point.id))
              }
              aria-pressed={selectedId === point.id}
            >
              <span className="journey-pin-dot" aria-hidden />
              <span className="journey-pin-label">{point.label}</span>
              <span className="journey-pin-meta">
                {pointKindLabel(point.kind)}
                {point.yearStart ? ` · ${point.yearStart}` : ""}
              </span>
            </button>
          </div>
        ))}
      </div>

      <div className="journey-actions">
        <label className="journey-add">
          <span className="sr-only">新坐标名称</span>
          <input
            type="text"
            placeholder="添加 B/D 点名称…"
            value={draftLabel}
            onChange={(e) => setDraftLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
          <button type="button" className="btn-secondary" onClick={handleAdd}>
            添加坐标
          </button>
        </label>
        <button
          type="button"
          className="btn-ghost"
          onClick={toggleMostlyAtBirth}
          aria-pressed={journey.mostlyAtBirth}
        >
          {journey.mostlyAtBirth ? "取消「主要在 A」" : "标记一生主要在 A"}
        </button>
      </div>

      {selected ? (
        <aside className="journey-detail" aria-label="坐标详情">
          <h3>{selected.label}</h3>
          <p>{selected.memorySnippet ?? "暂无回忆摘要，可在后续版本编辑。"}</p>
          {selected.lat != null && selected.lng != null ? (
            <p className="journey-detail-coords">
              坐标 {selected.lat.toFixed(2)}, {selected.lng.toFixed(2)}
            </p>
          ) : null}
        </aside>
      ) : null}
    </section>
  );
}
