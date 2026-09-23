# 量化人生 APP · 开发文档

> 版本：v0.1  
> 关联文档：[产品文档](./量化人生APP-产品文档.md) · [UI 设计文档](./量化人生APP-UI设计文档.md)  
> 代码仓库：**Gauge**（React 18 + TypeScript + Vite 5 + Vitest）

---

## 1. 技术栈与仓库结构

| 层级 | 选型 | 说明 |
|------|------|------|
| 前端 | React 18, TS 5 | 单页应用，后续可拆 PWA / Capacitor |
| 构建 | Vite 5 | `npm run dev` → `:5173` |
| 测试 | Vitest + Testing Library | 纯函数 + 组件 |
| 样式 | 原生 CSS | `src/index.css`，暗色令牌 |
| 后端（v2） | 待定（Supabase / 自建 API） | MVP 无强制后端 |

```
/workspace
  docs/
    量化人生概念.md
    量化人生APP-产品文档.md
    量化人生APP-UI设计文档.md
    量化人生APP-开发文档.md      ← 本文
  src/
    quantified-life.ts           # 核心指标与阶段
    quantified-life.test.ts
    life-journey.ts              # [规划] 坐标 A/B/C 与节点规则
    life-journey.test.ts         # [规划]
    components/
      Gauge.tsx
      Gauge.test.tsx
      JourneyStrip.tsx           # [规划]
      NodeAdvicePanel.tsx        # [规划]
    App.tsx
    main.tsx
    index.css
```

---

## 2. 领域模型

### 2.1 已有：`QuantifiedLifeInputs` / `Snapshot`

定义于 `src/quantified-life.ts`：

- 输入：`assets`, `workload`, `wardrobeUtilization`, `outfitSatisfaction`, `age`  
- 派生：`dopamineIndex`, `currentStage`, `stageProgress`, `meaningScore`  
- 纯函数：`computeDopamineIndex`, `getLifeStageForAge`, `buildQuantifiedLifeSnapshot`

**多巴胺归一化**（实现细节）：

```ts
raw = assets - workload
dopamineIndex = clamp(0, 100, 50 + raw / 2)
```

中性点：资产与工作量相等时约 50 分。

**意义分默认权重**：

```ts
meaningScore = dopamine * 0.5 + wardrobe * 0.25 + outfit * 0.25
```

v1 扩展：`MeaningWeights` 可配置，总和应为 1。

### 2.2 规划：`LifePoint`（人生坐标）

```ts
export type LifePointKind = "birth" | "visited" | "planned";

export interface LifePoint {
  id: string;
  kind: LifePointKind;
  label: string;           // 显示名，如「家乡 A」「上海 B」
  /** 可选 WGS84 */
  lat?: number;
  lng?: number;
  /** 到访或计划年份 */
  yearStart?: number;
  yearEnd?: number;
  memorySnippet?: string;  // ≤280 字
  createdAt: string;       // ISO
}
```

**约束**：

- 有且仅有一个 `kind === "birth"`（A 点）。  
- `planned` 点可没有 `yearEnd`。

### 2.3 规划：`LifeJourneyState`

```ts
export interface LifeJourneyState {
  points: LifePoint[];
  /** 是否用户自述「一生主要在 A」— 影响空状态与节点 copy */
  mostlyAtBirth: boolean;
}
```

### 2.4 规划：`NodeAdvice`（节点顾问）

```ts
export type MetricEffect = "up" | "down" | "neutral";

export interface NodeAdviceOption {
  id: string;
  title: string;           // 方案 A
  steps: string[];         // max 3
  effects: Partial<Record<
    "workload" | "dopamineIndex" | "assets" | "wardrobeUtilization" | "outfitSatisfaction",
    MetricEffect
  >>;
  riskNote: string;
}

export interface NodeAdviceBundle {
  id: string;
  triggeredAt: string;
  reason: string;          // 规则命中说明
  stageId: LifeStageId;
  options: NodeAdviceOption[];
}
```

---

## 3. 节点规则引擎（MVP 本地）

文件建议：`src/life-journey.ts`（与 UI 解耦，100% 单测覆盖）。

### 3.1 规则接口

```ts
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
```

### 3.2 内置规则示例

| rule id | 条件 | 输出概要 |
|---------|------|----------|
| `high-workload-low-dopamine` | workload≥70 且 dopamine&lt;40 | 边界实验 / 短途位移 / 衣橱仪式 |
| `stage-intern` | stage=intern | 技能资产 vs 探索 B 点 |
| `stage-retire-soon` | age≥58 && stage=work | 退休坐标规划、工作量下行 |
| `mostly-at-birth` | mostlyAtBirth && points.length===1 | 深化 A 点关系与满意度，非「必须离开」 |

`evaluateAdvisor(ctx): NodeAdviceBundle | null` — 取最高 priority 的首条命中。

### 3.3 禁止事项

- 规则内 **不得** 调用网络。  
- **不得** 返回单选项（至少 2 个 `NodeAdviceOption`）。  
- 文案来自常量或 i18n 表，便于产品审阅。

---

## 4. 前端架构

### 4.1 状态管理（MVP）

- React `useState` + `useMemo`（与当前 `App.tsx` 一致）。  
- 输入合并：`QuantifiedLifeInputs` + `LifeJourneyState` 可分层 state 或 `useReducer`。  
- 持久化（v1）：`localStorage` key `quantified-life:v1` JSON schema 见 §6。

### 4.2 组件职责

| 组件 | 职责 |
|------|------|
| `App` | 布局、live 模拟、组合 snapshot + advisor |
| `Gauge` | 展示单项指标 |
| `JourneyStrip` | 渲染 A→B→C，触发 Drawer |
| `NodeAdvicePanel` | 展示 `NodeAdviceBundle`，反馈按钮 |
| `StageMeta` | 可抽离自 App concept-panel |

### 4.3 数据流

```
User inputs / journey edits
        ↓
buildQuantifiedLifeSnapshot(inputs) → snapshot
        ↓
evaluateAdvisor({ snapshot, journey }) → bundle | null
        ↓
Gauge grid + JourneyStrip + NodeAdvicePanel
```

---

## 5. API 设计（v2 预留）

REST 风格示例，非 MVP 范围。

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/v1/me/snapshot` | 聚合指标 |
| PUT | `/v1/me/inputs` | 更新自评指标 |
| CRUD | `/v1/me/points` | 人生坐标 |
| GET | `/v1/me/advisor` | 服务端规则（需版本号） |
| POST | `/v1/me/advisor/:id/feedback` | helpful / dismiss |

**cloudWardrobe 集成**（v2）：

- Webhook 或 pull：`wardrobeUtilization` 自动更新。  
- OAuth scope：`wardrobe.read`  

---

## 6. 本地存储 Schema

```json
{
  "version": 1,
  "inputs": {
    "assets": 62,
    "workload": 48,
    "wardrobeUtilization": 71,
    "outfitSatisfaction": 68,
    "age": 28
  },
  "journey": {
    "mostlyAtBirth": false,
    "points": [
      {
        "id": "a1",
        "kind": "birth",
        "label": "A · 成都",
        "lat": 30.57,
        "lng": 104.07,
        "yearStart": 1998,
        "yearEnd": 2018
      }
    ]
  },
  "weights": {
    "dopamine": 0.5,
    "wardrobe": 0.25,
    "outfit": 0.25
  },
  "advisorFeedback": []
}
```

迁移：读取时校验 `version`，缺省字段用 `DEFAULT_QUANTIFIED_LIFE`。

---

## 7. 测试策略

### 7.1 单元测试（必须）

| 模块 | 用例示例 |
|------|----------|
| `quantified-life` | 边界 age、多巴胺 clamp、意义分权重 |
| `life-journey` | 规则命中顺序、仅 A 点、多方案数量 |
| `gauge-utils` | 弧路径、颜色分段 |

运行：`npm test` / `npm run test:watch`

### 7.2 组件测试

- `Gauge`：渲染 label/value；warning 态可选。  
- `NodeAdvicePanel`：点击反馈回调。

### 7.3 E2E（v1）

- Playwright：引导 → 改 age → 节点出现/消失。  

### 7.4 CI

- `npm run typecheck`  
- `npm run build`  
- `npm test`  

Cloud Agent：见 `.cursor/environment.json`（`npm ci` + `npm run dev`）。

---

## 8. 开发里程碑与任务拆分

### Phase 0（当前）

- [x] `quantified-life.ts` + 测试  
- [x] `Gauge` + `App` 仪表盘  
- [x] 三份产品/UI/开发文档  

### Phase 1（MVP UI 扩展）

- [ ] 实现 `life-journey.ts` + 规则 + 测试  
- [ ] `JourneyStrip` + `NodeAdvicePanel`  
- [ ] `App.tsx` 集成；localStorage 持久化  
- [ ] README 链接新文档  

### Phase 2（v1）

- [ ] 意义分权重 UI  
- [ ] 地图底图或 MapLibre 暗色样式  
- [ ] 导出 JSON  

### Phase 3（v2）

- [ ] 账号与同步 API  
- [ ] cloudWardrobe 客户端  

---

## 9. 本地开发命令

```bash
npm ci
npm run dev      # http://localhost:5173
npm test
npm run build
npm run typecheck
```

---

## 10. 代码规范

- 业务逻辑放纯函数模块，组件只做展示与事件。  
- 导出类型与函数显式命名；避免 magic number（权重抽常量 `DEFAULT_MEANING_WEIGHTS`）。  
- 中文用户可见字符串：MVP 可硬编码于组件；v1 抽 `src/i18n/zh.ts`。  
- 不引入临时 debug log 进 main 分支。

---

## 11. 安全与隐私（实现要点）

- 位置数据默认仅 `localStorage`；上传需设置页 opt-in。  
- 导出文件不含 token。  
- Advisor 反馈若上传，仅匿名 aggregate（v2）。

---

## 12. 附录：与产品/UI 的追溯矩阵

| 产品需求 | UI 页面 | 代码模块 |
|----------|---------|----------|
| 仪表盘 | P-HOME | `quantified-life`, `Gauge`, `App` |
| A/B/C 坐标 | P-MAP | `LifePoint`, `JourneyStrip` |
| 节点最优解（参考） | P-NODES | `AdvisorRule`, `NodeAdvicePanel` |
| 意义分权重 | P-SETTINGS | `computeMeaningScore(w)` |
| 衣橱指标 | P-HOME | 输入字段，v2 同步 job |

---

*实现 Phase 1 时请先补充 `life-journey.test.ts` 再改 UI，保证规则行为可回归。*
