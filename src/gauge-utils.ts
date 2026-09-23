export interface GaugeGeometry {
  /** SVG path describing the background arc (full sweep). */
  trackPath: string;
  /** SVG path describing the value arc (0..value sweep). */
  valuePath: string;
  /** Coordinates for the tip of the needle. */
  needle: { x: number; y: number };
  /** Center of the gauge in SVG coordinates. */
  center: { x: number; y: number };
}

export interface GaugeOptions {
  min?: number;
  max?: number;
  /** Start angle in degrees (default -120 = lower-left). */
  startAngle?: number;
  /** End angle in degrees (default 120 = lower-right). */
  endAngle?: number;
  radius?: number;
  size?: number;
}

const DEFAULTS = {
  min: 0,
  max: 100,
  startAngle: -120,
  endAngle: 120,
  radius: 80,
  size: 200,
} as const;

/**
 * Clamp a value into the inclusive [min, max] range.
 */
export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

/**
 * Map a value within [min, max] to a fraction in [0, 1].
 * Returns 0 when the range is degenerate (min === max).
 */
export function valueToFraction(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return clamp((value - min) / (max - min), 0, 1);
}

/**
 * Convert a fraction [0,1] to an angle in degrees between startAngle and endAngle.
 */
export function fractionToAngle(
  fraction: number,
  startAngle: number,
  endAngle: number
): number {
  const f = clamp(fraction, 0, 1);
  return startAngle + (endAngle - startAngle) * f;
}

/**
 * Convert a polar coordinate (angle in degrees, measured clockwise from the top)
 * to a cartesian point around a center. This matches SVG's coordinate system
 * where y grows downward.
 */
export function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number
): { x: number; y: number } {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  };
}

/**
 * Build an SVG arc path from a start angle to an end angle around a center.
 */
export function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(cx, cy, radius, startAngle);
  const end = polarToCartesian(cx, cy, radius, endAngle);
  const largeArcFlag = Math.abs(endAngle - startAngle) <= 180 ? 0 : 1;
  const sweepFlag = endAngle >= startAngle ? 1 : 0;
  return [
    "M",
    round(start.x),
    round(start.y),
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    sweepFlag,
    round(end.x),
    round(end.y),
  ].join(" ");
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}

/**
 * Compute the full geometry needed to render a gauge for a given value.
 */
export function computeGaugeGeometry(
  value: number,
  options: GaugeOptions = {}
): GaugeGeometry {
  const { min, max, startAngle, endAngle, radius, size } = {
    ...DEFAULTS,
    ...options,
  };
  const cx = size / 2;
  const cy = size / 2;
  const fraction = valueToFraction(value, min, max);
  const valueAngle = fractionToAngle(fraction, startAngle, endAngle);

  return {
    center: { x: cx, y: cy },
    trackPath: describeArc(cx, cy, radius, startAngle, endAngle),
    valuePath: describeArc(cx, cy, radius, startAngle, valueAngle),
    needle: polarToCartesian(cx, cy, radius - 12, valueAngle),
  };
}

/**
 * Pick a semantic color for a value based on the fraction of its range.
 */
export function colorForFraction(fraction: number): string {
  const f = clamp(fraction, 0, 1);
  if (f < 0.5) return "#22c55e"; // green
  if (f < 0.8) return "#f59e0b"; // amber
  return "#ef4444"; // red
}
