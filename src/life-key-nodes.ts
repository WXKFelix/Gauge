import type { LifeStageId, QuantifiedLifeSnapshot } from "./quantified-life";
import type { NodeAdviceBundle, NodeAdviceOption } from "./life-advice-types";
import type { AdvisorContext } from "./life-journey";

export interface LifeKeyNodeDefinition {
  id: string;
  label: string;
  ageMin: number;
  ageMax: number;
  /** Shorter copy for timeline */
  tagline: string;
}

export const LIFE_KEY_NODES: LifeKeyNodeDefinition[] = [
  {
    id: "exam-path",
    label: "升学与专业方向",
    ageMin: 17,
    ageMax: 22,
    tagline: "把学习资产变成下一阶段选项",
  },
  {
    id: "first-career",
    label: "首份正式工作",
    ageMin: 22,
    ageMax: 26,
    tagline: "第一份工作决定节奏，不决定一生",
  },
  {
    id: "city-move",
    label: "换城 / 迁徙决策",
    ageMin: 24,
    ageMax: 35,
    tagline: "A 点与 B 点之间，是否要多一个坐标",
  },
  {
    id: "thirty-checkpoint",
    label: "30 岁阶段复盘",
    ageMin: 28,
    ageMax: 33,
    tagline: "资产、工作量与坐标是否仍匹配",
  },
  {
    id: "forty-balance",
    label: "40 岁平衡窗口",
    ageMin: 38,
    ageMax: 43,
    tagline: "峰值负荷 vs 长期健康与关系",
  },
  {
    id: "retire-plan",
    label: "退休与下半场规划",
    ageMin: 55,
    ageMax: 63,
    tagline: "降负荷与人生坐标并重",
  },
];

export function getActiveKeyNode(
  age: number
): LifeKeyNodeDefinition | undefined {
  const matches = LIFE_KEY_NODES.filter(
    (n) => age >= n.ageMin && age <= n.ageMax
  );
  if (matches.length === 0) return undefined;
  // Prefer the narrowest age window when several overlap (e.g. 28–33 vs 24–35).
  return matches.sort((a, b) => {
    const spanA = a.ageMax - a.ageMin;
    const spanB = b.ageMax - b.ageMin;
    if (spanA !== spanB) return spanA - spanB;
    return b.ageMin - a.ageMin;
  })[0];
}

export function getUpcomingKeyNode(
  age: number
): LifeKeyNodeDefinition | undefined {
  return LIFE_KEY_NODES.find((n) => age < n.ageMin);
}

function optimal(
  partial: Omit<NodeAdviceOption, "tier">
): NodeAdviceOption {
  return { ...partial, tier: "optimal" };
}

function alt(partial: Omit<NodeAdviceOption, "tier">): NodeAdviceOption {
  return { ...partial, tier: "alternative" };
}

function bundleForNode(
  node: LifeKeyNodeDefinition,
  stageId: LifeStageId,
  reason: string,
  options: NodeAdviceOption[]
): NodeAdviceBundle {
  return {
    id: `key-${node.id}-${Date.now()}`,
    triggeredAt: new Date().toISOString(),
    nodeId: node.id,
    nodeLabel: node.label,
    reason,
    stageId,
    options,
  };
}

export function buildKeyNodeAdvice(
  ctx: AdvisorContext
): NodeAdviceBundle | null {
  const node = getActiveKeyNode(ctx.snapshot.age);
  if (!node) return null;

  const { snapshot, journey } = ctx;
  const hasPlannedMove = journey.points.some((p) => p.kind === "planned");

  switch (node.id) {
    case "exam-path":
      return bundleForNode(
        node,
        snapshot.currentStage.id,
        `关键节点「${node.label}」：在现有条件下，优先巩固可迁移的能力资产。`,
        [
          optimal({
            id: "opt-skill-track",
            title: "最优解 · 技能主线",
            steps: [
              "选定 1 条未来 3 年仍有用的能力线（专业/语言/工具）",
              "用 12 周项目制产出可展示成果（作品/证书/开源）",
              "每两周对照「资产指数」自评是否上升",
            ],
            effects: { assets: "up", workload: "up" },
            riskNote: "短期娱乐社交会减少，需提前和身边人沟通目标。",
          }),
          alt({
            id: "alt-explore",
            title: "备选 · 小步探索",
            steps: [
              "并行尝试 2 个方向各 4 周，记录兴趣与反馈",
              "不急于定终身标签，但每段探索要有书面复盘",
            ],
            effects: { dopamineIndex: "up", assets: "neutral" },
            riskNote: "探索期易焦虑，需设定探索截止时间。",
          }),
        ]
      );

    case "first-career":
      return bundleForNode(
        node,
        snapshot.currentStage.id,
        `关键节点「${node.label}」：最优解强调「可迁移技能 + 可承受工作量」。`,
        [
          optimal({
            id: "opt-first-job",
            title: "最优解 · 匹配型入职",
            steps: [
              "选岗位：70% 能力匹配 + 30% 拉伸，避免纯消耗型加班文化",
              "前 90 天建立 1 位内部导师 + 1 项可量化产出",
              "每月检查工作量自评，超过 70 分即启动边界对话",
            ],
            effects: { assets: "up", workload: "neutral" },
            riskNote: "理想岗位不总是立刻得到，可设 6 个月再评估窗口。",
          }),
          alt({
            id: "alt-intern-extend",
            title: "备选 · 过渡实习/项目制",
            steps: [
              "以项目制或实习延长缓冲，换取作品集与行业认知",
              "明确过渡终点日期，避免无限「准备中」",
            ],
            effects: { assets: "up", dopamineIndex: "neutral" },
            riskNote: "收入可能偏低，需财务缓冲计划。",
          }),
        ]
      );

    case "city-move":
      if (!hasPlannedMove && journey.points.length < 2) {
        return null;
      }
      return bundleForNode(
        node,
        snapshot.currentStage.id,
        `关键节点「${node.label}」：你已标记新坐标或计划，适合做一次结构化决策。`,
        [
          optimal({
            id: "opt-move-trial",
            title: "最优解 · 先试驻再定居",
            steps: [
              "先 1–3 个月短驻或远程试水目标城市（B/C 点）",
              "列出不可妥协项：收入、通勤、关系、医疗",
              "试驻结束用「多巴胺 + 资产」自评对比 A 点基线",
            ],
            effects: { dopamineIndex: "up", assets: "neutral" },
            riskNote: "搬家成本高，试驻仍可能有押金与机会成本。",
          }),
          alt({
            id: "alt-stay-deepen",
            title: "备选 · 留在 A 深耕",
            steps: [
              "不搬也能扩圈：换行业/远程/同城新社区",
              "在坐标页强化 A 点回忆与关系投资",
            ],
            effects: { assets: "up", outfitSatisfaction: "up" },
            riskNote: "需抵抗「别人都在换城」的比较压力。",
          }),
        ]
      );

    case "thirty-checkpoint":
      return bundleForNode(
        node,
        snapshot.currentStage.id,
        `关键节点「${node.label}」：默认最优解是「校正工作量，保护长期资产」。`,
        [
          optimal({
            id: "opt-30-rebalance",
            title: "最优解 · 结构再平衡",
            steps: [
              "若工作量 ≥ 65：砍掉 1 类低价值事务，换 1 项健康或关系投资",
              "核对 B/C 坐标是否仍代表真实目标，过时则更新或归档",
              "设定下一季度 1 个可验证的资产目标（技能/储蓄/作品）",
            ],
            effects: { workload: "down", assets: "up", dopamineIndex: "up" },
            riskNote: "降负荷可能短期影响晋升感知，需长期视角。",
          }),
          alt({
            id: "alt-30-double-down",
            title: "备选 · 阶段性冲刺",
            steps: [
              "若你主动选择冲刺：限定 6 个月并设健康红线指标",
              "冲刺结束必须安排恢复周",
            ],
            effects: { assets: "up", workload: "up" },
            riskNote: "不适合已长期高负荷者，慎用。",
          }),
        ]
      );

    case "forty-balance":
      return bundleForNode(
        node,
        snapshot.currentStage.id,
        `关键节点「${node.label}」：最优解把峰值产出与可持续负荷绑定。`,
        [
          optimal({
            id: "opt-40-sustain",
            title: "最优解 · 可持续峰值",
            steps: [
              "保留 1 项核心产出，其余授权或放弃",
              "固定睡眠/运动底线，写入日历不可抢占",
              "与重要关系对齐未来 5 年坐标规划",
            ],
            effects: { workload: "down", dopamineIndex: "up", assets: "neutral" },
            riskNote: "角色收缩需要组织信任，提前沟通。",
          }),
          alt({
            id: "alt-40-pivot",
            title: "备选 · 第二曲线",
            steps: [
              "每周 5 小时投入新曲线试错（教学/咨询/创作）",
              "12 周评估是否值得加大投入",
            ],
            effects: { assets: "up", dopamineIndex: "up" },
            riskNote: "双轨并行会增加短期工作量。",
          }),
        ]
      );

    case "retire-plan":
      return bundleForNode(
        node,
        snapshot.currentStage.id,
        `关键节点「${node.label}」：最优解是渐进降负荷 + 明确常驻坐标。`,
        [
          optimal({
            id: "opt-retire",
            title: "最优解 · 渐进过渡",
            steps: [
              "与组织/家庭对齐 3 年过渡时间表",
              "工作量每季度下调一点，补社交与兴趣资产",
              "在坐标页标记「下半场」常驻点候选",
            ],
            effects: { workload: "down", dopamineIndex: "up" },
            riskNote: "财务需单独规划，本 APP 不提供投资建议。",
          }),
          alt({
            id: "alt-phased-work",
            title: "备选 · 阶段性工作",
            steps: [
              "咨询/兼职/项目制延续价值感",
              "控制每周小时上限",
            ],
            effects: { assets: "neutral", dopamineIndex: "up" },
            riskNote: "需避免名义退休仍满负荷。",
          }),
        ]
      );

    default:
      return null;
  }
}
