import { useEffect, useState } from "react";
import { Gauge } from "./components/Gauge";

interface Metric {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  value: number;
}

const INITIAL_METRICS: Metric[] = [
  { key: "cpu", label: "CPU Load", unit: "%", min: 0, max: 100, value: 32 },
  { key: "mem", label: "Memory", unit: "%", min: 0, max: 100, value: 61 },
  { key: "net", label: "Network", unit: "MB/s", min: 0, max: 100, value: 18 },
  { key: "temp", label: "Temp", unit: "°C", min: 20, max: 100, value: 74 },
];

function nextValue(metric: Metric): number {
  const span = metric.max - metric.min;
  const drift = (Math.random() - 0.5) * span * 0.15;
  const next = metric.value + drift;
  return Math.min(Math.max(next, metric.min), metric.max);
}

export default function App() {
  const [metrics, setMetrics] = useState<Metric[]>(INITIAL_METRICS);
  const [live, setLive] = useState(true);

  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => {
      setMetrics((prev) => prev.map((m) => ({ ...m, value: nextValue(m) })));
    }, 1200);
    return () => clearInterval(id);
  }, [live]);

  return (
    <main className="app">
      <header className="app-header">
        <h1>Gauge</h1>
        <p className="subtitle">Real-time metrics dashboard</p>
        <button
          className="toggle"
          onClick={() => setLive((v) => !v)}
          aria-pressed={live}
        >
          {live ? "Pause" : "Resume"} live updates
        </button>
      </header>

      <section className="gauge-grid">
        {metrics.map((m) => (
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
