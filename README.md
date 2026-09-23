# 量化人生

**量化人生**：用数据帮助每个人管理和提升人生。本仓库为 Web/App 客户端（React、TypeScript、Vite）——仪表盘展示用户关心的维度，并说明每项指标「为何有用」。

概念说明见 [docs/量化人生概念.md](docs/量化人生概念.md)。

**量化人生 APP** 完整设计（独立文档）：

| 文档 | 路径 |
|------|------|
| 产品文档 | [docs/量化人生APP-产品文档.md](docs/量化人生APP-产品文档.md) |
| UI 设计文档 | [docs/量化人生APP-UI设计文档.md](docs/量化人生APP-UI设计文档.md) |
| 开发文档 | [docs/量化人生APP-开发文档.md](docs/量化人生APP-开发文档.md) |
| UI 可视化图鉴 | [docs/量化人生APP-UI可视化图鉴.md](docs/量化人生APP-UI可视化图鉴.md) |

## Tech stack

- [Vite](https://vitejs.dev/) 5 for dev server and bundling
- [React](https://react.dev/) 18 + TypeScript
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) for unit/component tests

## Getting started

Requirements: Node.js 20+ (developed on Node 22) and npm.

```bash
npm ci        # install exact dependencies from package-lock.json
npm run dev   # start the dev server at http://localhost:5173
```

## Scripts

| Command            | Description                                        |
| ------------------ | -------------------------------------------------- |
| `npm run dev`      | Start the Vite dev server on port 5173.            |
| `npm run build`    | Type-check (`tsc --noEmit`) and build to `dist/`.  |
| `npm run preview`  | Preview the production build on port 4173.         |
| `npm test`         | Run the unit and component test suites once.       |
| `npm run test:watch` | Run tests in watch mode.                         |
| `npm run typecheck` | Type-check without emitting.                       |

## Project structure

```
src/
  components/
    Gauge.tsx          # SVG gauge component
    Gauge.test.tsx     # component tests
  gauge-utils.ts       # pure geometry/color helpers
  gauge-utils.test.ts  # unit tests for the helpers
  quantified-life.ts   # 量化人生模型（多巴胺、阶段、意义分）
  quantified-life.test.ts
  App.tsx              # 量化人生仪表盘
  main.tsx             # React entry point
  index.css            # styles
```

## Cloud Agent environment

This repository is configured for Cursor Cloud Agents via
[`.cursor/environment.json`](.cursor/environment.json):

- `install`: `npm ci`
- `terminals`: runs `npm run dev` so the dashboard is available while an agent works.
