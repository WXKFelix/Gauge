import type { LifeStageId } from "./quantified-life";

export type MetricEffect = "up" | "down" | "neutral";

export type AdvisorMetricKey =
  | "workload"
  | "dopamineIndex"
  | "assets"
  | "wardrobeUtilization"
  | "outfitSatisfaction";

export interface NodeAdviceOption {
  id: string;
  title: string;
  steps: string[];
  effects: Partial<Record<AdvisorMetricKey, MetricEffect>>;
  riskNote: string;
  tier?: "optimal" | "alternative";
}

export interface NodeAdviceBundle {
  id: string;
  triggeredAt: string;
  reason: string;
  stageId: LifeStageId;
  options: NodeAdviceOption[];
  nodeId?: string;
  nodeLabel?: string;
}
