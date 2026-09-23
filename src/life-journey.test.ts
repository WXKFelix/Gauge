import { describe, expect, it } from "vitest";
import {
  ADVISOR_RULES,
  DEFAULT_JOURNEY,
  addVisitedPoint,
  evaluateAdvisor,
  sortJourneyPoints,
} from "./life-journey";
import {
  DEFAULT_QUANTIFIED_LIFE,
  buildQuantifiedLifeSnapshot,
} from "./quantified-life";

describe("life-journey", () => {
  it("sorts birth first then by year", () => {
    const sorted = sortJourneyPoints(DEFAULT_JOURNEY.points);
    expect(sorted[0]?.kind).toBe("birth");
  });

  it("evaluateAdvisor returns at least two options", () => {
    const snapshot = buildQuantifiedLifeSnapshot({
      ...DEFAULT_QUANTIFIED_LIFE,
      workload: 75,
      assets: 50,
    });
    const bundle = evaluateAdvisor({
      snapshot,
      journey: DEFAULT_JOURNEY,
    });
    expect(bundle).not.toBeNull();
    expect(bundle!.options.length).toBeGreaterThanOrEqual(2);
  });

  it("mostly-at-birth rule matches single A point", () => {
    const journey = {
      mostlyAtBirth: true,
      points: [DEFAULT_JOURNEY.points[0]!],
    };
    const snapshot = buildQuantifiedLifeSnapshot(DEFAULT_QUANTIFIED_LIFE);
    const bundle = evaluateAdvisor({ snapshot, journey });
    expect(bundle?.reason).toMatch(/A 点附近深耕/);
  });

  it("addVisitedPoint appends visited point", () => {
    const next = addVisitedPoint(DEFAULT_JOURNEY, "D · 测试", 2025);
    expect(next.points.some((p) => p.label.includes("D"))).toBe(true);
    expect(next.mostlyAtBirth).toBe(false);
  });

  it("every rule builds at least two options", () => {
    const snapshot = buildQuantifiedLifeSnapshot({
      ...DEFAULT_QUANTIFIED_LIFE,
      age: 23,
    });
    for (const rule of ADVISOR_RULES) {
      const ctx = {
        snapshot,
        journey: DEFAULT_JOURNEY,
      };
      if (rule.match(ctx)) {
        const bundle = rule.build(ctx);
        expect(bundle.options.length).toBeGreaterThanOrEqual(2);
      }
    }
  });
});
