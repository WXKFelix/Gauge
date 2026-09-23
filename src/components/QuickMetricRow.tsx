export interface QuickMetric {
  key: string;
  label: string;
  value: number;
  unit: string;
  warn?: boolean;
}

export function QuickMetricRow({ items }: { items: QuickMetric[] }) {
  return (
    <div className="quick-metrics" role="list">
      {items.map((item) => (
        <div
          key={item.key}
          className={`quick-metric${item.warn ? " quick-metric--warn" : ""}`}
          role="listitem"
        >
          <span className="quick-metric-value">
            {Math.round(item.value)}
            <small>{item.unit}</small>
          </span>
          <span className="quick-metric-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
