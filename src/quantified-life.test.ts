import { describe, expect, it } from "vitest";
import {
  buildQuantifiedLifeSnapshot,
  computeDopamineIndex,
  computeMeaningScore,
  computeStageProgress,
  getLifeStageForAge,
} from "./quantified-life";

describe("computeDopamineIndex", () => {
  it("is higher when assets exceed workload", () => {
    expect(computeDopamineIndex(80, 40)).toBeGreaterThan(
      computeDopamineIndex(40, 80)
    );
  });

  it("centers at 50 when assets equal workload", () => {
    expect(computeDopamineIndex(60, 60)).toBeCloseTo(50);
  });
});

describe("getLifeStageForAge", () => {
  it("maps working ages to 工作", () => {
    expect(getLifeStageForAge(30).label).toBe("工作");
  });

  it("maps student ages to 学习", () => {
    expect(getLifeStageForAge(18).label).toBe("学习");
  });
});

describe("computeStageProgress", () => {
  it("returns 0 at stage start", () => {
    const stage = getLifeStageForAge(24);
    expect(computeStageProgress(24, stage)).toBe(0);
  });
});

describe("computeMeaningScore", () => {
  it("weights dopamine most heavily", () => {
    const high = computeMeaningScore(90, 50, 50);
    const low = computeMeaningScore(10, 50, 50);
    expect(high).toBeGreaterThan(low);
  });
});

describe("buildQuantifiedLifeSnapshot", () => {
  it("includes derived fields", () => {
    const snap = buildQuantifiedLifeSnapshot({
      assets: 70,
      workload: 30,
      wardrobeUtilization: 80,
      outfitSatisfaction: 75,
      age: 28,
    });
    expect(snap.dopamineIndex).toBeGreaterThan(50);
    expect(snap.currentStage.label).toBe("工作");
    expect(snap.meaningScore).toBeGreaterThan(0);
    expect(snap.meaningScore).toBeLessThanOrEqual(100);
  });
});
