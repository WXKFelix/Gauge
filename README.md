# Gauge

> 量化人生 — *Quantify Life*

A small real-time gauge dashboard built with **React**, **TypeScript**, and **Vite**.
It renders a grid of SVG gauges (CPU, memory, network, temperature) whose values
drift over time to simulate a live metrics feed.

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
  App.tsx              # dashboard with live-updating metrics
  main.tsx             # React entry point
  index.css            # styles
```

## Cloud Agent environment

This repository is configured for Cursor Cloud Agents via
[`.cursor/environment.json`](.cursor/environment.json):

- `install`: `npm ci`
- `terminals`: runs `npm run dev` so the dashboard is available while an agent works.
