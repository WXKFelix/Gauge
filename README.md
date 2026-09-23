# Gauge · 量化人生

**Life, measured. Choices, clear.**  
看清你走的线，算清岔口的代价。

独立产品仓库：[WXKFelix/Gauge](https://github.com/WXKFelix/Gauge)。与 **cloudWardrobe（云衣柜）** 完全分离：不合并代码、不共用 EAS `projectId`。

## 文档

| 文档 | 路径 |
|------|------|
| 产品 PRD | [docs/product/PRD.md](docs/product/PRD.md) |
| UI 规范 | [docs/design/UI-SPEC.md](docs/design/UI-SPEC.md) |
| 开发说明 | [docs/development/README.md](docs/development/README.md) |
| 概念索引 | [docs/量化人生概念.md](docs/量化人生概念.md) |

## 产品概要（MVP）

- **Onboarding**：价值观（成长 / 稳定 / 风险）→ 人生主线 → 锚点 A + 当前站 B  
- **Tab**：今日（签到 + 对齐度）· 轨迹 · 决策（Offer 向导）· 设置（导出 JSON）  
- **原则**：无人生总分、无排行榜；关键节点 2～3 条 Pareto 路径 + 假设 + 复盘日  

目标技术栈：**Expo SDK 56** + React Native + TypeScript + expo-router + zod（详见开发文档）。

## 当前仓库状态

本分支可能仍包含 **Vite + React** 的早期仪表盘原型（`npm run dev`，端口 5173），用于 SVG Gauge 与量化公式实验。**正式 MVP 以 Expo 工程为准**（见 [docs/development/README.md](docs/development/README.md)）。

### Vite 原型（若尚未迁移）

```bash
npm ci
npm run dev    # http://localhost:5173
npm test
npm run typecheck
```

### Expo MVP（ scaffold 完成后）

```bash
npm ci
CI=1 npx expo start --web --port 8081   # 浏览器标题：量化人生
```

## Cloud Agent

[`.cursor/environment.json`](.cursor/environment.json) 配置安装与开发服务器。在 Gauge 环境内开发时，Web 验证优先：`CI=1 npx expo start --web --port 8081`（Expo 就绪后更新 `environment.json` 中的终端命令）。

若 push 出现 403，请确认 Cursor Environment 与 GitHub App 已授权 **Gauge** 仓库，而非 cloudWardrobe。
