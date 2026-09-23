# Agent / 开发协作说明

## Git 分支命名（当前约定）

- 功能与日常开发分支：`cursor/<描述性名称>-dev`
- 示例：`cursor/quantified-life-app-docs-dev`
- 在团队另行规定之前，**新开发分支统一使用 `-dev` 后缀**，不再使用 `-a002` 等后缀。

## 本地启动

```bash
npm ci
npm run dev   # http://localhost:5173
```

## 文档入口

见 [README.md](./README.md) 中「量化人生 APP」文档表。
