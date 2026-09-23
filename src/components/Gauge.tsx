import {
  clamp,
  colorForFraction,
  computeGaugeGeometry,
  valueToFraction,
} from "../gauge-utils";

export interface GaugeProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  size?: number;
  /** Highlights border when metric needs attention. */
  warn?: boolean;
}

export function Gauge({
  label,
  value,
  min = 0,
  max = 100,
  unit = "",
  size = 200,
  warn = false,
}: GaugeProps) {
  const clamped = clamp(value, min, max);
  const fraction = valueToFraction(clamped, min, max);
  const color = colorForFraction(fraction);
  const geometry = computeGaugeGeometry(clamped, { min, max, size });

  return (
    <figure
      className={`gauge${warn ? " gauge--warn" : ""}`}
      aria-label={`${label} gauge`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${label}: ${Math.round(clamped)}${unit}`}
      >
        <path
          d={geometry.trackPath}
          fill="none"
          stroke="#1e293b"
          strokeWidth={14}
          strokeLinecap="round"
        />
        <path
          d={geometry.valuePath}
          fill="none"
          stroke={color}
          strokeWidth={14}
          strokeLinecap="round"
          style={{ transition: "stroke 300ms ease, d 300ms ease" }}
        />
        <line
          x1={geometry.center.x}
          y1={geometry.center.y}
          x2={geometry.needle.x}
          y2={geometry.needle.y}
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <circle
          cx={geometry.center.x}
          cy={geometry.center.y}
          r={6}
          fill={color}
        />
        <text
          x={geometry.center.x}
          y={geometry.center.y + 40}
          textAnchor="middle"
          className="gauge-value"
          fill="#e2e8f0"
        >
          {Math.round(clamped)}
          {unit}
        </text>
      </svg>
      <figcaption className="gauge-label">{label}</figcaption>
    </figure>
  );
}
