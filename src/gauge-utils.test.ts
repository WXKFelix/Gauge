import { describe, expect, it } from "vitest";
import {
  clamp,
  colorForFraction,
  computeGaugeGeometry,
  describeArc,
  fractionToAngle,
  polarToCartesian,
  valueToFraction,
} from "./gauge-utils";

describe("clamp", () => {
  it("keeps values within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("clamps below the minimum", () => {
    expect(clamp(-3, 0, 10)).toBe(0);
  });

  it("clamps above the maximum", () => {
    expect(clamp(42, 0, 10)).toBe(10);
  });

  it("returns min for NaN", () => {
    expect(clamp(Number.NaN, 2, 10)).toBe(2);
  });
});

describe("valueToFraction", () => {
  it("maps the midpoint to 0.5", () => {
    expect(valueToFraction(50, 0, 100)).toBeCloseTo(0.5);
  });

  it("maps the minimum to 0", () => {
    expect(valueToFraction(0, 0, 100)).toBe(0);
  });

  it("maps the maximum to 1", () => {
    expect(valueToFraction(100, 0, 100)).toBe(1);
  });

  it("clamps out-of-range values", () => {
    expect(valueToFraction(150, 0, 100)).toBe(1);
    expect(valueToFraction(-10, 0, 100)).toBe(0);
  });

  it("handles a degenerate range", () => {
    expect(valueToFraction(5, 5, 5)).toBe(0);
  });

  it("supports non-zero minimums", () => {
    expect(valueToFraction(60, 20, 100)).toBeCloseTo(0.5);
  });
});

describe("fractionToAngle", () => {
  it("returns the start angle at fraction 0", () => {
    expect(fractionToAngle(0, -120, 120)).toBe(-120);
  });

  it("returns the end angle at fraction 1", () => {
    expect(fractionToAngle(1, -120, 120)).toBe(120);
  });

  it("returns the midpoint angle at fraction 0.5", () => {
    expect(fractionToAngle(0.5, -120, 120)).toBe(0);
  });
});

describe("polarToCartesian", () => {
  it("places angle 0 directly above the center", () => {
    const p = polarToCartesian(100, 100, 50, 0);
    expect(p.x).toBeCloseTo(100);
    expect(p.y).toBeCloseTo(50);
  });

  it("places angle 90 to the right of the center", () => {
    const p = polarToCartesian(100, 100, 50, 90);
    expect(p.x).toBeCloseTo(150);
    expect(p.y).toBeCloseTo(100);
  });
});

describe("describeArc", () => {
  it("produces a valid SVG arc command", () => {
    const path = describeArc(100, 100, 80, -120, 120);
    expect(path.startsWith("M ")).toBe(true);
    expect(path).toContain("A 80 80");
  });

  it("sets the large-arc flag for sweeps greater than 180 degrees", () => {
    const path = describeArc(100, 100, 80, -170, 170);
    const parts = path.split(" ");
    const arcIndex = parts.indexOf("A");
    expect(parts[arcIndex + 4]).toBe("1");
  });
});

describe("colorForFraction", () => {
  it("is green in the low range", () => {
    expect(colorForFraction(0.2)).toBe("#22c55e");
  });

  it("is amber in the mid range", () => {
    expect(colorForFraction(0.65)).toBe("#f59e0b");
  });

  it("is red in the high range", () => {
    expect(colorForFraction(0.95)).toBe("#ef4444");
  });
});

describe("computeGaugeGeometry", () => {
  it("returns paths and a needle within the viewport", () => {
    const geo = computeGaugeGeometry(50, { size: 200 });
    expect(geo.center).toEqual({ x: 100, y: 100 });
    expect(geo.trackPath.length).toBeGreaterThan(0);
    expect(geo.valuePath.length).toBeGreaterThan(0);
    expect(geo.needle.x).toBeGreaterThanOrEqual(0);
    expect(geo.needle.x).toBeLessThanOrEqual(200);
    expect(geo.needle.y).toBeGreaterThanOrEqual(0);
    expect(geo.needle.y).toBeLessThanOrEqual(200);
  });
});
