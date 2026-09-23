import type { QuantifiedLifeInputs } from "../quantified-life";

const FIELDS: {
  key: keyof Pick<
    QuantifiedLifeInputs,
    "assets" | "workload" | "wardrobeUtilization" | "outfitSatisfaction"
  >;
  label: string;
}[] = [
  { key: "assets", label: "资产指数" },
  { key: "workload", label: "工作量" },
  { key: "wardrobeUtilization", label: "生活利用率" },
  { key: "outfitSatisfaction", label: "穿搭满意度" },
];

export interface MetricSlidersProps {
  inputs: QuantifiedLifeInputs;
  onChange: (next: QuantifiedLifeInputs) => void;
}

export function MetricSliders({ inputs, onChange }: MetricSlidersProps) {
  return (
    <section className="metric-sliders" aria-labelledby="sliders-heading">
      <h2 id="sliders-heading">调节自评（即时刷新最优解）</h2>
      <p className="metric-sliders-lede">
        拖动滑块模拟不同人生状态，节点 Tab 会同步更新推荐方案。
      </p>
      <ul className="metric-sliders-list">
        {FIELDS.map(({ key, label }) => (
          <li key={key}>
            <label className="metric-slider-row">
              <span className="metric-slider-label">
                {label}
                <strong>{Math.round(inputs[key])}</strong>
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={inputs[key]}
                onChange={(e) =>
                  onChange({
                    ...inputs,
                    [key]: Number(e.target.value),
                  })
                }
              />
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
