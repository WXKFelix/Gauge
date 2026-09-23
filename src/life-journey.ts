import { buildKeyNodeAdvice } from "./life-key-nodes";
import type { LifeStageId, QuantifiedLifeSnapshot } from "./quantified-life";

export type LifePointKind = "birth" | "visited" | "planned";

export interface LifePoint {
  id: string;
  kind: LifePointKind;
  label: string;
  lat?: number;
  lng?: number;
  yearStart?: number;
  yearEnd?: number;
  memorySnippet?: string;
  createdAt: string;
}

export interface LifeJourneyState {
  points: LifePoint[];
  mostlyAtBirth: boolean;
}

export type {
  AdvisorMetricKey,
  MetricEffect,
  NodeAdviceBundle,
  NodeAdviceOption,
} from "./life-advice-types";
import type {
  NodeAdviceBundle,
  NodeAdviceOption,
} from "./life-advice-types";

export interface AdvisorContext {
  snapshot: QuantifiedLifeSnapshot;
  journey: LifeJourneyState;
}

export type AdvisorRule = {
  id: string;
  priority: number;
  match: (ctx: AdvisorContext) => boolean;
  build: (ctx: AdvisorContext) => NodeAdviceBundle;
};

const nowIso = () => new Date().toISOString();

export function createLifePointId(): string {
  return `pt_${Math.random().toString(36).slice(2, 10)}`;
}

export const DEFAULT_JOURNEY: LifeJourneyState = {
  mostlyAtBirth: false,
  points: [
    {
      id: "birth-a",
      kind: "birth",
      label: "A · 出生地与成长",
      yearStart: 1998,
      yearEnd: 2018,
      memorySnippet: "前二十年，世界多半在 A 点附近。",
      createdAt: "2020-01-01T00:00:00.000Z",
    },
    {
      id: "visit-b",
      kind: "visited",
      label: "B · 求学/工作城",
      yearStart: 2018,
      yearEnd: 2024,
      memorySnippet: "在 B 点留下工作与友谊。",
      createdAt: "2020-01-01T00:00:00.000Z",
    },
    {
      id: "plan-c",
      kind: "planned",
      label: "C · 下一站？",
      yearStart: 2026,
      memorySnippet: "可能的迁徙或长途旅行。",
      createdAt: "2020-01-01T00:00:00.000Z",
    },
  ],
};

export function getBirthPoint(journey: LifeJourneyState): LifePoint | undefined {
  return journey.points.find((p) => p.kind === "birth");
}

export function sortJourneyPoints(points: LifePoint[]): LifePoint[] {
  const birth = points.filter((p) => p.kind === "birth");
  const rest = points
    .filter((p) => p.kind !== "birth")
    .slice()
    .sort((a, b) => (a.yearStart ?? 0) - (b.yearStart ?? 0));
  return [...birth, ...rest];
}

function bundleBase(
  ruleId: string,
  stageId: LifeStageId,
  reason: string,
  options: NodeAdviceOption[]
): NodeAdviceBundle {
  return {
    id: `${ruleId}-${Date.now()}`,
    triggeredAt: nowIso(),
    reason,
    stageId,
    options,
  };
}

export const ADVISOR_RULES: AdvisorRule[] = [
  {
    id: "high-workload-low-dopamine",
    priority: 100,
    match: ({ snapshot }) =>
      snapshot.workload >= 70 && snapshot.dopamineIndex < 40,
    build: ({ snapshot }) =>
      bundleBase(
        "high-workload-low-dopamine",
        snapshot.currentStage.id,
        "工作量偏高且多巴胺 proxy 偏低，结构可能失衡。",
        [
          {
            id: "boundary",
            title: "方案 A · 边界实验",
            steps: [
              "列出未来 4 周可拒绝的一类低价值加班",
              "每周保留 2 晚不安排事务",
              "周末记录工作量与情绪各 1 次",
            ],
            effects: { workload: "down", dopamineIndex: "up", assets: "neutral" },
            riskNote: "短期可能影响可见产出，需与团队提前沟通预期。",
          },
          {
            id: "short-trip",
            title: "方案 B · 短途前往新坐标",
            steps: [
              "选择 2–3 天可到达的 D 点",
              "只做一件小事：散步或见一位朋友",
              "回来写 3 行回忆，不强制发朋友圈",
            ],
            effects: {
              dopamineIndex: "up",
              assets: "down",
              workload: "neutral",
            },
            riskNote: "有花费与行程成本，注意预算与身体状态。",
          },
          {
            id: "wardrobe-ritual",
            title: "方案 C · 生活仪式",
            steps: [
              "列出 7 项本周必做的小习惯",
              "标记 30 天未推进的计划项",
              "每天 1 分钟生活利用率与穿搭满意度自评",
            ],
            effects: {
              wardrobeUtilization: "up",
              outfitSatisfaction: "up",
              dopamineIndex: "up",
            },
            riskNote: "不解决根本过载，但可快速改善日常体验感。",
          },
        ]
      ),
  },
  {
    id: "stage-intern",
    priority: 80,
    match: ({ snapshot }) => snapshot.currentStage.id === "intern",
    build: ({ snapshot }) =>
      bundleBase(
        "stage-intern",
        snapshot.currentStage.id,
        "实习阶段：在技能资产与探索新坐标之间做平衡。",
        [
          {
            id: "skill",
            title: "方案 A · 深化技能资产",
            steps: [
              "选定 1 项可展示的技能栈",
              "8 周内完成 1 个可演示的小成果",
              "找前辈做 1 次反馈复盘",
            ],
            effects: { assets: "up", workload: "up" },
            riskNote: "可能减少探索时间，需确认与职业方向一致。",
          },
          {
            id: "explore-b",
            title: "方案 B · 探索 B 点",
            steps: [
              "在现城市标记 1 个「B 点」回忆锚点",
              "每月 1 次新路线通勤或骑行",
              "记录对「是否换城」的真实感受",
            ],
            effects: { dopamineIndex: "up", assets: "neutral" },
            riskNote: "探索带来不确定性，避免为打卡而打卡。",
          },
        ]
      ),
  },
  {
    id: "stage-retire-soon",
    priority: 70,
    match: ({ snapshot }) =>
      snapshot.currentStage.id === "work" && snapshot.age >= 58,
    build: ({ snapshot }) =>
      bundleBase(
        "stage-retire-soon",
        snapshot.currentStage.id,
        "接近退休窗口：工作量下行与坐标规划可并行考虑。",
        [
          {
            id: "slow-workload",
            title: "方案 A · 渐进降负荷",
            steps: [
              "与组织讨论角色过渡或节奏调整",
              "将高耗精力事务逐步交接",
              "每季度检查工作量自评是否下降",
            ],
            effects: { workload: "down", dopamineIndex: "up" },
            riskNote: "依赖组织环境，需提前沟通。",
          },
          {
            id: "retire-point",
            title: "方案 B · 退休坐标规划",
            steps: [
              "列出 A 点与 1–2 个候选常驻点",
              "评估医疗、社交与成本",
              "标记「计划」坐标，不急于立刻搬迁",
            ],
            effects: { dopamineIndex: "up", assets: "neutral" },
            riskNote: "重大决策，建议与家人及专业人士讨论。",
          },
        ]
      ),
  },
  {
    id: "mostly-at-birth",
    priority: 60,
    match: ({ journey }) =>
      journey.mostlyAtBirth && journey.points.length === 1,
    build: ({ snapshot }) =>
      bundleBase(
        "mostly-at-birth",
        snapshot.currentStage.id,
        "你选择在 A 点附近深耕——这是完整的人生轨迹，不是「未完成」。",
        [
          {
            id: "deepen-a",
            title: "方案 A · 深化 A 点关系",
            steps: [
              "列出 3 位想更常联系的人",
              "每月 1 次高质量对话",
              "记录一件只在 A 才能做的事",
            ],
            effects: {
              outfitSatisfaction: "up",
              dopamineIndex: "up",
              assets: "up",
            },
            riskNote: "无需离开 A 也能扩展体验，避免与他人比较。",
          },
          {
            id: "micro-travel",
            title: "方案 B · 微旅行不出圈",
            steps: [
              "在 A 周边 50km 选 1 个一日目的地",
              "当作「临时 B 点」写短回忆",
              "不设定「必须定居外地」的目标",
            ],
            effects: { dopamineIndex: "up", workload: "neutral" },
            riskNote: "若体力或预算有限，可缩短为半日散步。",
          },
        ]
      ),
  },
];

/** Metric/stage rules (urgent imbalance, etc.) */
export function evaluateAdvisor(ctx: AdvisorContext): NodeAdviceBundle | null {
  const matched = ADVISOR_RULES.filter((r) => r.match(ctx)).sort(
    (a, b) => b.priority - a.priority
  );
  const rule = matched[0];
  if (!rule) return null;
  const bundle = rule.build(ctx);
  if (bundle.options.length < 2) return null;
  return withOptimalTier(bundle);
}

/**
 * Life key-node advice: age-window milestones with a recommended 最优解.
 * Shown when no urgent metric rule wins, or alongside on the nodes tab.
 */
export function evaluateKeyNodeAdvisor(
  ctx: AdvisorContext
): NodeAdviceBundle | null {
  const bundle = buildKeyNodeAdvice(ctx);
  if (!bundle || bundle.options.length < 2) return null;
  return withOptimalTier(bundle);
}

/** Primary bundle for the nodes tab: urgent rules override key milestones. */
export function resolveNodeTabAdvice(
  ctx: AdvisorContext
): NodeAdviceBundle | null {
  return evaluateAdvisor(ctx) ?? evaluateKeyNodeAdvisor(ctx);
}

function withOptimalTier(bundle: NodeAdviceBundle): NodeAdviceBundle {
  const options = bundle.options.map((opt, i) => ({
    ...opt,
    tier: opt.tier ?? (i === 0 ? ("optimal" as const) : ("alternative" as const)),
  }));
  return { ...bundle, options };
}

export function addVisitedPoint(
  journey: LifeJourneyState,
  label: string,
  yearStart?: number
): LifeJourneyState {
  const point: LifePoint = {
    id: createLifePointId(),
    kind: "visited",
    label: label.trim() || "新坐标",
    yearStart: yearStart ?? new Date().getFullYear(),
    createdAt: nowIso(),
  };
  return {
    ...journey,
    mostlyAtBirth: false,
    points: [...journey.points, point],
  };
}

export type AdvisorFeedback = {
  bundleId: string;
  optionId: string;
  helpful: boolean;
  at: string;
};
