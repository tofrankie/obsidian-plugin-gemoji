## 1. 依赖与映射切换

- [x] 1.1 用 `gemoji` 替换 shortcode 查询接入，并将冗余的 `emoji-map.ts` 透传层移除
- [x] 1.2 补齐 `gemoji` 接入所需的 alias 兼容逻辑，确保现有渲染结果保持一致
- [x] 1.3 从依赖与构建配置中移除 `node-emoji` 的运行路径引用，避免双数据源并存

## 2. 验证与清理

- [x] 2.1 更新或确认现有测试覆盖 `gemoji` 接入后的常见 shortcode 与 alias 行为
- [x] 2.2 运行 `pnpm test`、`pnpm typecheck` 和必要的构建验证，确认替换后无行为回归
- [x] 2.3 清理 README 或其他文档中仍指向 `node-emoji` 的说明，使文档与实现一致
