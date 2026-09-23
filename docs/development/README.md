# Gauge · 量化人生 — 开发文档

**产品 PRD**：[docs/product/PRD.md](../product/PRD.md)  
**UI 规范**：[docs/design/UI-SPEC.md](../design/UI-SPEC.md)  
**仓库**：[WXKFelix/Gauge](https://github.com/WXKFelix/Gauge) — 与 **cloudWardrobe** 无代码/EAS 共用。

---

## 1. 技术栈（MVP，P8）

| 层 | 选型 |
|----|------|
| 框架 | **Expo SDK 56** + **React Native** |
| 语言 | **TypeScript**（`strict`） |
| 路由 | **expo-router**（文件系统路由） |
| 校验 | **zod** |
| 存储 | iOS/Android：**expo-sqlite**；Web：**AsyncStorage** JSON（同一套 db API，`Platform` 分流） |
| 决策引擎 | `src/engine/job-offer.ts` 纯函数，可单元测试 |
| 明确不要 | 自建后端、Redux、人生排行榜 API |

---

## 2. 环境要求

- Node.js 20+（推荐 22）
- npm 或 pnpm（仓库以 npm + lockfile 为准时：`npm ci`）

### 2.1 安装与运行

```bash
npm ci
npx expo start
```

**Web（Cloud Agent / CI 验证）**：

```bash
CI=1 npx expo start --web --port 8081
```

浏览器标题应为 **「量化人生」**（见 `app.json` / Web `title` 配置）。

**原生**：Expo Go 或 dev client 扫码；SQLite 仅在原生路径启用。

### 2.2 Cloud VM 约定（P13）

- Metro 长进程请用 **tmux** 会话，例如：`gauge-expo-web`。
- 验证优先 **Web**：`CI=1 npx expo start --web --port 8081`。
- 仅修改 **Gauge** 仓库；勿引用 cloudWardrobe 代码或 EAS `projectId`。

### 2.3 测试

```bash
npm test                 # Jest：engine + 关键 hooks
npm run typecheck        # tsc --noEmit
```

Offer 引擎测试重点：`src/engine/job-offer.test.ts`（边界输入、三路径、假设非空）。

---

## 3. 目录结构（目标 Expo MVP）

```
Gauge/
├── app/                          # expo-router
│   ├── _layout.tsx               # 根布局、主题 Provider
│   ├── index.tsx                 # 重定向：onboarding 或 (tabs)
│   ├── onboarding/
│   │   ├── _layout.tsx
│   │   ├── values.tsx            # 步骤 1：价值观滑条
│   │   ├── storyline.tsx         # 步骤 2：人生主线
│   │   └── anchors.tsx           # 步骤 3：锚点 A + 当前站 B
│   ├── (tabs)/
│   │   ├── _layout.tsx           # 今日 | 轨迹 | 决策 | 设置
│   │   ├── today.tsx
│   │   ├── journey.tsx
│   │   ├── decisions.tsx
│   │   └── settings.tsx
│   └── decision/
│       ├── job-offer/
│       │   ├── _layout.tsx       # StepIndicator 四步
│       │   ├── step-1-context.tsx
│       │   ├── step-2-compensation.tsx
│       │   ├── step-3-time.tsx
│       │   ├── step-4-bottom-lines.tsx
│       │   └── result.tsx        # PathCard 并列 + 免责声明
│       └── [id].tsx              # 历史决策详情
├── src/
│   ├── components/               # UI-SPEC 组件
│   │   ├── Screen.tsx
│   │   ├── Card.tsx
│   │   ├── SliderField.tsx
│   │   ├── AlignmentRing.tsx
│   │   ├── Sparkline.tsx
│   │   ├── PathCard.tsx
│   │   ├── TimelineNode.tsx
│   │   └── StepIndicator.tsx
│   ├── engine/
│   │   └── job-offer.ts          # 纯函数 + zod schema 导出
│   ├── db/
│   │   ├── index.ts              # 统一 API
│   │   ├── sqlite.native.ts
│   │   └── async-storage.web.ts
│   ├── theme/
│   │   └── tokens.ts             # 色板 #2D4A3E / #F7F5F2 / #C4A574
│   └── hooks/
│       ├── useProfile.ts
│       ├── useCheckins.ts
│       └── useDecisions.ts
├── docs/
│   ├── product/PRD.md
│   ├── design/UI-SPEC.md
│   └── development/README.md     # 本文件
├── app.json
├── package.json
└── tsconfig.json
```

> **说明**：若仓库根目录仍存在 Vite 版 `src/App.tsx` 演示，视为历史原型；新功能一律在 Expo 树上述路径开发。迁移完成后可删除 Vite 入口。

---

## 4. 路由表

| 路径 | 屏幕 | 备注 |
|------|------|------|
| `/` | 引导或 Tabs | 无 profile → `/onboarding/values` |
| `/onboarding/values` | 价值观 | 成长 / 稳定 / 风险 1–10 |
| `/onboarding/storyline` | 主线 | 单行或多行文本 |
| `/onboarding/anchors` | A + B | 完成后写 profile，`replace` 到 `/(tabs)/today` |
| `/(tabs)/today` | 今日 | 签到 + AlignmentRing |
| `/(tabs)/journey` | 轨迹 | life_stages CRUD |
| `/(tabs)/decisions` | 决策 | Offer 入口 + 列表 |
| `/(tabs)/settings` | 设置 | 主线、导出、原则 |
| `/decision/job-offer/step-*` | Offer 向导 | 四步 |
| `/decision/job-offer/result` | 结果 | 引擎输出持久化到 `decisions` |
| `/decision/[id]` | 历史 | 只读 PathCard + 假设 |

Deep link（后续）：`gauge://decision/job-offer` — MVP 可不注册。

---

## 5. 数据层

### 5.1 存储分流

```typescript
// src/db/index.ts（示意）
import { Platform } from "react-native";
export const db = Platform.OS === "web"
  ? require("./async-storage.web").createDb()
  : require("./sqlite.native").createDb();
```

Web 层将下表序列化为 JSON 文档（如 `gauge_db_v1`）；Native 使用 SQLite 表结构等价实现。

### 5.2 表 / 集合

#### `profile`（单行）

| 列 | 类型 | 说明 |
|----|------|------|
| id | TEXT PK | 固定 `local` |
| growth_weight | REAL | 1–10 |
| stability_weight | REAL | 1–10 |
| risk_weight | REAL | 1–10 |
| storyline | TEXT | 人生主线 |
| anchor_a_label | TEXT | 锚点 A 名称 |
| anchor_a_note | TEXT | 可选叙述 |
| current_station_label | TEXT | 当前站 B |
| onboarding_done | INTEGER | 0/1 |
| updated_at | TEXT ISO | |

#### `life_stages`

| 列 | 类型 | 说明 |
|----|------|------|
| id | TEXT PK | uuid |
| title | TEXT | 阶段名 |
| start_date | TEXT | 可选 ISO 日期 |
| end_date | TEXT | 可选 |
| narrative | TEXT | **不可量化叙述** |
| sort_order | INTEGER | 时间线排序 |
| created_at | TEXT | |

#### `daily_checkins`

| 列 | 类型 | 说明 |
|----|------|------|
| id | TEXT PK | uuid |
| date | TEXT UNIQUE | `YYYY-MM-DD` |
| energy | INTEGER | 1–10 |
| storyline_focus | INTEGER | 1–10 主线投入 |
| mood | INTEGER | 1–10 |
| note | TEXT | 可选 |
| alignment_score | REAL | 衍生缓存，可重算 |

**对齐度（示意）**：`f(energy, storyline_focus, mood)` 与价值观权重加权，结果仅用于**今日环**与趋势，**不**写入全局排名。

#### `decisions`

| 列 | 类型 | 说明 |
|----|------|------|
| id | TEXT PK | uuid |
| type | TEXT | MVP：`job_offer` |
| input_json | TEXT | zod 序列化输入 |
| output_json | TEXT | 引擎输出（paths[], assumptions[], review_date） |
| created_at | TEXT | |

### 5.3 导出 JSON

设置页「导出」：`{ profile, life_stages, daily_checkins, decisions, exported_at }`，便于备份与迁移。

---

## 6. 决策引擎 `job-offer.ts`

### 6.1 职责

- 输入：`JobOfferInput`（zod）
- 输出：`JobOfferResult`：`paths: PathOption[]`（2～3 条）、`assumptions: string[]`、`reviewDate: string`
- **纯函数**：无 IO、无 LLM

### 6.2 路径类型

| path_id | 标题 | 说明 |
|---------|------|------|
| accept | 接受 Offer | 财务增、时间成本、成长项 |
| stay | 留任 | 稳定、已知成本 |
| negotiate | 条件性谈判 | 在底线约束下的中间态 |

每条 `PathOption` 字段：

- `financial`, `time`, `growth`, `stability`：0–100 分项（**并列展示，不选唯一 winner**）
- `referenceScore`：综合参考分（可选显示，带「非建议唯一答案」 copy）
- `reversibility`: `high` | `medium` | `low`
- `assumptions`: string[]

### 6.3 税率与时间（MVP 简化）

- 税后年增：固定有效税率或用户可配置默认值（文档化，如 20% 示意）
- 时间成本：`(commute_delta_min * 2 * 250 + overtime_delta_h * 52)` 分钟/年 → 换算为「等效小时/年」展示

单元测试必须锁定公式，避免 UI 改数字。

---

## 7. 与 Cursor Environment 对齐

`.cursor/environment.json` 建议（Expo MVP 就绪后）：

```json
{
  "name": "Gauge",
  "install": "npm ci",
  "terminals": [
    {
      "name": "expo-web",
      "command": "CI=1 npx expo start --web --port 8081"
    }
  ]
}
```

当前若仍为 Vite `npm run dev`，以完成 Expo scaffold 后的配置为准。

---

## 8. Git / 推送（P14）

若 `git push` 返回 **403**：

1. Cursor Environment 是否选中 **WXKFelix/Gauge**
2. GitHub App 是否授权 **Gauge** 仓库
3. 必要时新开 Agent 刷新 token  
勿用 cloudWardrobe 环境的 Agent push 本仓库。

---

## 9. 实现检查清单（MVP Done）

- [ ] Onboarding 三步写入 `profile`
- [ ] 今日签到 + 7 日 Sparkline
- [ ] 轨迹 CRUD + TimelineNode
- [ ] Offer 四步 + `job-offer.ts` + result PathCard
- [ ] 设置：编辑主线、导出 JSON、展示产品原则
- [ ] Web：`CI=1` 下标题「量化人生」
- [ ] 全仓无「人生总分」UI 与排行

---

## 10. 相关命令速查

| 命令 | 用途 |
|------|------|
| `npm ci` | 安装依赖 |
| `CI=1 npx expo start --web --port 8081` | Web 验证 |
| `npm test` | 引擎与组件测试 |
| `npm run typecheck` | TS 严格检查 |
