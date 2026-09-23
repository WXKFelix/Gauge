import { useEffect, useMemo, useState } from "react";
import { Gauge } from "./components/Gauge";
import { JourneyStrip } from "./components/JourneyStrip";
import { NodeAdvicePanel } from "./components/NodeAdvicePanel";
import {
  DEFAULT_JOURNEY,
  evaluateAdvisor,
  type LifeJourneyState,
} from "./life-journey";
import {
  DEFAULT_QUANTIFIED_LIFE,
  buildQuantifiedLifeSnapshot,
  driftMetric,
  type QuantifiedLifeInputs,
} from "./quantified-life";
import {
  loadPersistedState,
  savePersistedState,
  type PersistedAppState,
} from "./storage";

export default function App() {
  const [inputs, setInputs] = useState<QuantifiedLifeInputs>(() =>
    typeof window !== "undefined"
      ? loadPersistedState().inputs
      : DEFAULT_QUANTIFIED_LIFE
  );
  const [journey, setJourney] = useState<LifeJourneyState>(() =>
    typeof window !== "undefined"
      ? loadPersistedState().journey
      : {
          mostlyAtBirth: DEFAULT_JOURNEY.mostlyAtBirth,
          points: DEFAULT_JOURNEY.points.map((p) => ({ ...p })),
        }
  );
  const [advisorFeedback, setAdvisorFeedback] = useState<
    PersistedAppState["advisorFeedback"]
  >(() =>
    typeof window !== "undefined" ? loadPersistedState().advisorFeedback : []
  );
  const [live, setLive] = useState(true);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const snapshot = useMemo(
    () => buildQuantifiedLifeSnapshot(inputs),
    [inputs]
  );

  const advisorBundle = useMemo(
    () => evaluateAdvisor({ snapshot, journey }),
    [snapshot, journey]
  );

  useEffect(() => {
    savePersistedState({
      version: 1,
      inputs,
      journey,
      advisorFeedback,
    });
  }, [inputs, journey, advisorFeedback]);

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

  useEffect(() => {
    if (!feedbackToast) return;
    const t = setTimeout(() => setFeedbackToast(null), 2400);
    return () => clearTimeout(t);
  }, [feedbackToast]);

  const gauges = [
    {
      key: "assets",
      label: "资产指数",
      value: snapshot.assets,
      min: 0,
      max: 100,
      unit: "分",
      warn: false,
    },
    {
      key: "workload",
      label: "工作量",
      value: snapshot.workload,
      min: 0,
      max: 100,
      unit: "分",
      warn: snapshot.workload >= 70,
    },
    {
      key: "dopamine",
      label: "多巴胺指数",
      value: snapshot.dopamineIndex,
      min: 0,
      max: 100,
      unit: "分",
      warn: snapshot.dopamineIndex < 40,
    },
    {
      key: "wardrobe",
      label: "衣橱利用率",
      value: snapshot.wardrobeUtilization,
      min: 0,
      max: 100,
      unit: "%",
      warn: false,
    },
    {
      key: "outfit",
      label: "穿搭满意度",
      value: snapshot.outfitSatisfaction,
      min: 0,
      max: 100,
      unit: "分",
      warn: false,
    },
    {
      key: "meaning",
      label: "人生意义分",
      value: snapshot.meaningScore,
      min: 0,
      max: 100,
      unit: "分",
      warn: false,
    },
  ] as const;

  return (
    <main className="app">
      <header className="app-header">
        <p className="eyebrow">量化人生 APP · Gauge Web MVP</p>
        <h1>量化人生</h1>
        <p className="subtitle">
          人生坐标 A→B→C 与资产、工作量仪表盘 · 数据保存在本机
        </p>
        <button
          className="toggle"
          type="button"
          onClick={() => setLive((v) => !v)}
          aria-pressed={live}
        >
          {live ? "暂停" : "恢复"}模拟更新
        </button>
      </header>

      <JourneyStrip journey={journey} onJourneyChange={setJourney} />

      <NodeAdvicePanel
        bundle={advisorBundle}
        onFeedback={(fb) => {
          setAdvisorFeedback((prev) => [
            ...prev,
            { ...fb, at: new Date().toISOString() },
          ]);
          setFeedbackToast(fb.helpful ? "已记录：这条建议有帮助" : "已记录：暂不采纳");
        }}
      />

      {feedbackToast ? (
        <div className="toast" role="status">
          {feedbackToast}
        </div>
      ) : null}

      <section className="concept-panel" aria-labelledby="concept-heading">
        <h2 id="concept-heading">阶段与指标</h2>
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
            <dd>
              <label className="age-input">
                <span className="sr-only">年龄</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={inputs.age}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      age: Number(e.target.value) || 0,
                    }))
                  }
                />
                岁
              </label>
            </dd>
          </div>
          <div>
            <dt>阶段进度</dt>
            <dd>{snapshot.stageProgress.toFixed(0)}%</dd>
          </div>
        </dl>
        <p className="concept-link">
          文档：<code>docs/量化人生APP-UI可视化图鉴.md</code>
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
            warn={m.warn}
          />
        ))}
      </section>
    </main>
  );
}
