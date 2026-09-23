import { useEffect, useMemo, useState } from "react";
import { Gauge } from "./components/Gauge";
import {
  DEFAULT_QUANTIFIED_LIFE,
  buildQuantifiedLifeSnapshot,
  driftMetric,
  type QuantifiedLifeInputs,
} from "./quantified-life";

export default function App() {
  const [inputs, setInputs] = useState<QuantifiedLifeInputs>(
    DEFAULT_QUANTIFIED_LIFE
  );
  const [live, setLive] = useState(true);

  const snapshot = useMemo(
    () => buildQuantifiedLifeSnapshot(inputs),
    [inputs]
  );

  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => {
      setInputs((prev) => ({
        ...prev,
        assets: driftMetric(prev.assets, 0, 100),
        workload: driftMetric(prev.workload, 0, 100),
        wardrobeUtilization: driftMetric(prev.wardrobeUtilization, 0, 100),
        outfitSatisfaction: driftMetric(prev.outfitSatisfaction, 0, 100),
      }));
    }, 1400);
    return () => clearInterval(id);
  }, [live]);

  const gauges = [
    {
      key: "assets",
      label: "资产指数",
      value: snapshot.assets,
      min: 0,
      max: 100,
      unit: "分",
    },
    {
      key: "workload",
      label: "工作量",
      value: snapshot.workload,
      min: 0,
      max: 100,
      unit: "分",
    },
    {
      key: "dopamine",
      label: "多巴胺指数",
      value: snapshot.dopamineIndex,
      min: 0,
      max: 100,
      unit: "分",
    },
    {
      key: "wardrobe",
      label: "衣橱利用率",
      value: snapshot.wardrobeUtilization,
      min: 0,
      max: 100,
      unit: "%",
    },
    {
      key: "outfit",
      label: "穿搭满意度",
      value: snapshot.outfitSatisfaction,
      min: 0,
      max: 100,
      unit: "分",
    },
    {
      key: "meaning",
      label: "人生意义分",
      value: snapshot.meaningScore,
      min: 0,
      max: 100,
      unit: "分",
    },
  ] as const;

  return (
    <main className="app">
      <header className="app-header">
        <p className="eyebrow">cloudWardrobe-ui → Gauge</p>
        <h1>量化人生</h1>
        <p className="subtitle">资产、工作量与衣橱生活的可视化仪表盘</p>
        <button
          className="toggle"
          type="button"
          onClick={() => setLive((v) => !v)}
          aria-pressed={live}
        >
          {live ? "暂停" : "恢复"}模拟更新
        </button>
      </header>

      <section className="concept-panel" aria-labelledby="concept-heading">
        <h2 id="concept-heading">量化人生概念</h2>
        <p>
          多巴胺指数 ∝ <strong>资产 − 工作量</strong>；综合意义分结合衣橱利用率与穿搭满意度。
        </p>
        <dl className="stage-meta">
          <div>
            <dt>当前阶段</dt>
            <dd>{snapshot.currentStage.label}</dd>
          </div>
          <div>
            <dt>年龄</dt>
            <dd>{snapshot.age} 岁</dd>
          </div>
          <div>
            <dt>阶段进度</dt>
            <dd>{snapshot.stageProgress.toFixed(0)}%</dd>
          </div>
        </dl>
        <p className="concept-link">
          详见 <code>docs/量化人生概念.md</code>
        </p>
      </section>

      <section className="gauge-grid" aria-label="人生指标">
        {gauges.map((m) => (
          <Gauge
            key={m.key}
            label={m.label}
            value={m.value}
            min={m.min}
            max={m.max}
            unit={m.unit}
          />
        ))}
      </section>
    </main>
  );
}
