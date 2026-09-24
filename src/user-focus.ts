/** Areas users choose to track — content should match what helps them and what they care about. */
export type FocusAreaId =
  | "career"
  | "health"
  | "finance"
  | "relationship"
  | "growth"
  | "daily";

export interface FocusArea {
  id: FocusAreaId;
  label: string;
  hint: string;
}

export const FOCUS_AREAS: FocusArea[] = [
  {
    id: "career",
    label: "职业成长",
    hint: "阶段、工作量与关键节点建议",
  },
  {
    id: "health",
    label: "身心状态",
    hint: "负荷与恢复，避免用数字替代医疗",
  },
  {
    id: "finance",
    label: "财务资产",
    hint: "资产指数与长期积累趋势",
  },
  {
    id: "relationship",
    label: "关系与坐标",
    hint: "A/B/C 轨迹与重要的人",
  },
  {
    id: "growth",
    label: "学习成长",
    hint: "技能与资产中的「能力」部分",
  },
  {
    id: "daily",
    label: "日常生活",
    hint: "生活利用率、穿搭与日常满意度",
  },
];

export const DEFAULT_FOCUS_AREAS: FocusAreaId[] = [
  "career",
  "daily",
  "relationship",
];

export function toggleFocusArea(
  current: FocusAreaId[],
  id: FocusAreaId
): FocusAreaId[] {
  if (current.includes(id)) {
    const next = current.filter((x) => x !== id);
    return next.length === 0 ? current : next;
  }
  return [...current, id];
}
