/** Life stages used in the quantified-life model. */
export type LifeStageId =
  | "birth"
  | "study"
  | "intern"
  | "work"
  | "retire"
  | "death";

export interface LifeStage {
  id: LifeStageId;
  label: string;
  /** Typical age range start (years). */
  ageStart: number;
  ageEnd: number;
}

export const LIFE_STAGES: LifeStage[] = [
  { id: "birth", label: "出生", ageStart: 0, ageEnd: 3 },
  { id: "study", label: "学习", ageStart: 3, ageEnd: 22 },
  { id: "intern", label: "实习", ageStart: 22, ageEnd: 24 },
  { id: "work", label: "工作", ageStart: 24, ageEnd: 60 },
  { id: "retire", label: "退休", ageStart: 60, ageEnd: 80 },
  { id: "death", label: "死亡", ageStart: 80, ageEnd: 100 },
];

export interface QuantifiedLifeInputs {
  /** Asset index 0–100 (wealth, skills, social capital). */
  assets: number;
  /** Workload / effort index 0–100. */
  workload: number;
  /** Wardrobe utilization 0–100 (items worn vs idle). */
  wardrobeUtilization: number;
  /** Outfit satisfaction 0–100. */
  outfitSatisfaction: number;
  /** Current age in years. */
  age: number;
}

export interface QuantifiedLifeSnapshot extends QuantifiedLifeInputs {
  /** Normalized dopamine proxy: assets minus workload, mapped to 0–100. */
  dopamineIndex: number;
  /** Progress through current life stage, 0–100. */
  stageProgress: number;
  currentStage: LifeStage;
  /** Composite “meaning” score for the dashboard, 0–100. */
  meaningScore: number;
}

/**
 * Core model: dopamine ∝ (assets − workload), normalized to 0–100.
 */
export function computeDopamineIndex(assets: number, workload: number): number {
  const raw = assets - workload;
  return Math.min(100, Math.max(0, 50 + raw / 2));
}

export function getLifeStageForAge(age: number): LifeStage {
  const clamped = Math.min(100, Math.max(0, age));
  const stage =
    LIFE_STAGES.find(
      (s) => clamped >= s.ageStart && clamped < s.ageEnd
    ) ?? LIFE_STAGES[LIFE_STAGES.length - 1];
  return stage;
}

export function computeStageProgress(age: number, stage: LifeStage): number {
  const span = stage.ageEnd - stage.ageStart;
  if (span <= 0) return 100;
  const t = (age - stage.ageStart) / span;
  return Math.min(100, Math.max(0, t * 100));
}

/**
 * Weighted blend of dopamine, wardrobe use, and satisfaction.
 */
export function computeMeaningScore(
  dopamineIndex: number,
  wardrobeUtilization: number,
  outfitSatisfaction: number
): number {
  return (
    dopamineIndex * 0.5 +
    wardrobeUtilization * 0.25 +
    outfitSatisfaction * 0.25
  );
}

export function buildQuantifiedLifeSnapshot(
  inputs: QuantifiedLifeInputs
): QuantifiedLifeSnapshot {
  const currentStage = getLifeStageForAge(inputs.age);
  const dopamineIndex = computeDopamineIndex(inputs.assets, inputs.workload);
  const stageProgress = computeStageProgress(inputs.age, currentStage);
  const meaningScore = computeMeaningScore(
    dopamineIndex,
    inputs.wardrobeUtilization,
    inputs.outfitSatisfaction
  );
  return {
    ...inputs,
    dopamineIndex,
    stageProgress,
    currentStage,
    meaningScore,
  };
}

export const DEFAULT_QUANTIFIED_LIFE: QuantifiedLifeInputs = {
  assets: 62,
  workload: 48,
  wardrobeUtilization: 71,
  outfitSatisfaction: 68,
  age: 28,
};

export function driftMetric(value: number, min: number, max: number): number {
  const span = max - min;
  const drift = (Math.random() - 0.5) * span * 0.12;
  return Math.min(max, Math.max(min, value + drift));
}
