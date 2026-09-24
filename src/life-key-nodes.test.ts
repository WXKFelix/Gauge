import { describe, expect, it } from "vitest";
import { buildKeyNodeAdvice } from "./life-key-nodes";
import { DEFAULT_JOURNEY } from "./life-journey";
import {
  DEFAULT_QUANTIFIED_LIFE,
  buildQuantifiedLifeSnapshot,
} from "./quantified-life";

describe("life-key-nodes", () => {
  it("returns 30-year checkpoint with optimal tier for age 28", () => {
    const snapshot = buildQuantifiedLifeSnapshot({
      ...DEFAULT_QUANTIFIED_LIFE,
      age: 28,
    });
    const bundle = buildKeyNodeAdvice({
      snapshot,
      journey: DEFAULT_JOURNEY,
    });
    expect(bundle?.nodeLabel).toContain("30");
    expect(bundle?.options[0]?.tier).toBe("optimal");
    expect(bundle?.options.some((o) => o.title.includes("最优解"))).toBe(true);
  });

  it("resolve key node has at least two options", () => {
    const snapshot = buildQuantifiedLifeSnapshot({
      ...DEFAULT_QUANTIFIED_LIFE,
      age: 24,
    });
    const bundle = buildKeyNodeAdvice({
      snapshot,
      journey: DEFAULT_JOURNEY,
    });
    expect(bundle?.options.length).toBeGreaterThanOrEqual(2);
  });
});
