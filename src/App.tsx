import { useEffect, useMemo, useState } from "react";
import { AppTabBar, type AppTabId } from "./components/AppTabBar";
import { Gauge } from "./components/Gauge";
import { HeroMeaningCard } from "./components/HeroMeaningCard";
import { JourneyStrip } from "./components/JourneyStrip";
import { NodeAdvicePanel } from "./components/NodeAdvicePanel";
import { FocusPicker } from "./components/FocusPicker";
import { QuickMetricRow } from "./components/QuickMetricRow";
import { useGaugeSize } from "./hooks/useGaugeSize";
import { APP_MISSION, METRIC_HELP } from "./metric-copy";
import type { FocusAreaId } from "./user-focus";
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
  const [tab, setTab] = useState<AppTabId>("home");
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
  const [focusAreas, setFocusAreas] = useState<FocusAreaId[]>(() =>
    typeof window !== "undefined"
      ? loadPersistedState().focusAreas
      : ["career", "daily", "relationship"]
  );

  const gaugeSize = useGaugeSize("default");
  const heroGaugeSize = useGaugeSize("hero");

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
      focusAreas,
    });
  }, [inputs, journey, advisorFeedback, focusAreas]);

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
      label: "生活利用率",
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

  const quickMetrics = [
    {
      key: "assets",
      label: "资产",
      value: snapshot.assets,
      unit: "分",
    },
    {
      key: "workload",
      label: "工作量",
      value: snapshot.workload,
      unit: "分",
      warn: snapshot.workload >= 70,
    },
    {
      key: "dopamine",
      label: "多巴胺",
      value: snapshot.dopamineIndex,
      unit: "分",
      warn: snapshot.dopamineIndex < 40,
    },
  ];

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div className="app-topbar-brand">
          <span className="app-logo" aria-hidden>
            ◉
          </span>
          <div>
            <p className="app-topbar-title">量化人生</p>
            <p className="app-topbar-sub">数据为管理人生服务 · 本机保存</p>
          </div>
        </div>
        <button
          className="toggle toggle--compact"
          type="button"
          onClick={() => setLive((v) => !v)}
          aria-pressed={live}
        >
          {live ? "暂停" : "恢复"}
        </button>
      </header>

      <main className="app-main">
        <div
          id="panel-home"
          role="tabpanel"
          aria-labelledby="tab-home"
          hidden={tab !== "home"}
          className="tab-panel"
        >
          <p className="mission-banner">{APP_MISSION}</p>
          <HeroMeaningCard
            meaningScore={snapshot.meaningScore}
            stageLabel={snapshot.currentStage.label}
            stageProgress={snapshot.stageProgress}
            age={snapshot.age}
            gaugeSize={heroGaugeSize}
          />
          <FocusPicker selected={focusAreas} onChange={setFocusAreas} />
          <QuickMetricRow items={quickMetrics} />
          <p className="home-hint">
            {focusAreas.includes("relationship")
              ? "「坐标」记录你去过哪里、谁在那里；「节点」在关键阶段给出可执行参考。"
              : "「指标」里每项数据都附带说明——只为帮你管理和提升，不为了刷分。"}
          </p>
        </div>

        <div
          id="panel-journey"
          role="tabpanel"
          aria-labelledby="tab-journey"
          hidden={tab !== "journey"}
          className="tab-panel"
        >
          <JourneyStrip journey={journey} onJourneyChange={setJourney} />
        </div>

        <div
          id="panel-nodes"
          role="tabpanel"
          aria-labelledby="tab-nodes"
          hidden={tab !== "nodes"}
          className="tab-panel"
        >
          <NodeAdvicePanel
            bundle={advisorBundle}
            onFeedback={(fb) => {
              setAdvisorFeedback((prev) => [
                ...prev,
                { ...fb, at: new Date().toISOString() },
              ]);
              setFeedbackToast(
                fb.helpful ? "已记录：这条建议有帮助" : "已记录：暂不采纳"
              );
            }}
          />
        </div>

        <div
          id="panel-metrics"
          role="tabpanel"
          aria-labelledby="tab-metrics"
          hidden={tab !== "metrics"}
          className="tab-panel"
        >
          <section className="concept-panel" aria-labelledby="concept-heading">
            <h2 id="concept-heading">阶段与指标</h2>
            <p>
              下面每个数字都应对你有用。公式：多巴胺 ∝ <strong>资产 − 工作量</strong>；意义分结合你选的生活维度。
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
                      inputMode="numeric"
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
          </section>

          <section className="gauge-grid gauge-grid--metrics" aria-label="人生指标">
            {gauges.map((m) => (
              <div key={m.key} className="gauge-card-wrap">
                <Gauge
                  label={m.label}
                  value={m.value}
                  min={m.min}
                  max={m.max}
                  unit={m.unit}
                  warn={m.warn}
                  size={gaugeSize}
                />
                <p className="metric-help">{METRIC_HELP[m.key] ?? ""}</p>
              </div>
            ))}
          </section>
        </div>
      </main>

      {feedbackToast ? (
        <div className="toast" role="status">
          {feedbackToast}
        </div>
      ) : null}

      <AppTabBar
        active={tab}
        onChange={setTab}
        nodeBadge={advisorBundle != null}
      />
    </div>
  );
}
