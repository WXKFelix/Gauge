import { DEFAULT_QUANTIFIED_LIFE, type QuantifiedLifeInputs } from "./quantified-life";
import {
  DEFAULT_JOURNEY,
  type AdvisorFeedback,
  type LifeJourneyState,
} from "./life-journey";
import type { NavigatorPlan } from "./goal-navigator";
import {
  DEFAULT_FOCUS_AREAS,
  type FocusAreaId,
} from "./user-focus";

export const STORAGE_KEY = "quantified-life:v1";

export interface PersistedAppState {
  version: 1;
  inputs: QuantifiedLifeInputs;
  journey: LifeJourneyState;
  advisorFeedback: AdvisorFeedback[];
  focusAreas: FocusAreaId[];
  navigatorPlan: NavigatorPlan | null;
}

export function defaultPersistedState(): PersistedAppState {
  return {
    version: 1,
    inputs: { ...DEFAULT_QUANTIFIED_LIFE },
    journey: {
      mostlyAtBirth: DEFAULT_JOURNEY.mostlyAtBirth,
      points: DEFAULT_JOURNEY.points.map((p) => ({ ...p })),
    },
    advisorFeedback: [],
    focusAreas: [...DEFAULT_FOCUS_AREAS],
    navigatorPlan: null,
  };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export function parsePersistedState(raw: string | null): PersistedAppState {
  if (!raw) return defaultPersistedState();
  try {
    const data: unknown = JSON.parse(raw);
    if (!isRecord(data) || data.version !== 1) {
      return defaultPersistedState();
    }
    const base = defaultPersistedState();
    const inputs = isRecord(data.inputs)
      ? { ...base.inputs, ...data.inputs }
      : base.inputs;
    const journey = isRecord(data.journey) && Array.isArray(data.journey.points)
      ? {
          mostlyAtBirth: Boolean(data.journey.mostlyAtBirth),
          points: data.journey.points as LifeJourneyState["points"],
        }
      : base.journey;
    const advisorFeedback = Array.isArray(data.advisorFeedback)
      ? (data.advisorFeedback as AdvisorFeedback[])
      : [];
    const focusAreas = Array.isArray(data.focusAreas)
      ? (data.focusAreas as FocusAreaId[])
      : base.focusAreas;
    const navigatorPlan =
      data.navigatorPlan === null || data.navigatorPlan === undefined
        ? null
        : isRecord(data.navigatorPlan) &&
            Array.isArray(data.navigatorPlan.tasks)
          ? (data.navigatorPlan as unknown as NavigatorPlan)
          : null;
    return {
      version: 1,
      inputs,
      journey,
      advisorFeedback,
      focusAreas,
      navigatorPlan,
    };
  } catch {
    return defaultPersistedState();
  }
}

export function loadPersistedState(): PersistedAppState {
  if (typeof localStorage === "undefined") return defaultPersistedState();
  return parsePersistedState(localStorage.getItem(STORAGE_KEY));
}

export function savePersistedState(state: PersistedAppState): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
