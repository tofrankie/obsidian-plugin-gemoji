## Context

当前实现通过独立的 shortcode 查询封装调用 `node-emoji` 的 `get()` 完成 shortcode 查询。仓库同时已经安装了 `gemoji`，现有规格也强调使用与 GitHub 名称对齐的 gemoji 兼容目录，因此需要把查询接入切换到 [`wooorm/gemoji`](https://github.com/wooorm/gemoji)，但不能改变 `replaceEmojiShortcodes` 的输入输出契约，也不能影响 markdown 渲染阶段之外的逻辑。

## Goals / Non-Goals

**Goals:**

- 用 `gemoji` 替换 `node-emoji` 作为 shortcode 数据来源
- 保持当前 shortcode 匹配逻辑、未知值回退行为和 alias 测试结果不变
- 让依赖、映射实现与现有 spec 中的 gemoji 方向保持一致

**Non-Goals:**

- 不重写 `replaceEmojiShortcodes` 的正则或 DOM 处理流程
- 不新增设置项、自定义 emoji 或新的渲染场景
- 不主动扩大或收缩当前支持的 shortcode 集合，除非为兼容既有测试所必需

## Decisions

1. 在 `src/emoji.ts` 中直接使用 `gemoji` 的 `nameToEmoji`

   `emoji-map.ts` 只剩一层透传后已经没有独立价值，因此直接在 `replaceEmojiShortcodes` 内读取 `nameToEmoji` 更简单。这样仍然把依赖切换限制在单一模块内，不影响 markdown post processor 的调用方式，也更符合“少一层代码更好维护”的目标。

2. 直接复用 `gemoji` 原生提供的 alias 数据

   当前 `satisfied` 等 alias 行为已经被测试固定，而 `gemoji` 本身已经提供这些 alias 名称。因此实现可以直接读取 `nameToEmoji`，不再额外维护本地 alias 覆盖表，减少冗余实现并保持行为一致。

3. 同步清理依赖与打包配置中的 `node-emoji`

   替换映射实现后，应从 `package.json`、锁文件与必要的构建配置中移除 `node-emoji`。这样可以避免仓库同时保留两套数据源，降低后续维护歧义。

## Risks / Trade-offs

- `gemoji` 的数据结构与 `node-emoji` 查询接口不同 -> 将接入变化限制在 `src/emoji.ts` 内，避免扩散到渲染流程其他部分
- 个别 alias 在未来版本的 `gemoji` 中发生变化 -> 用现有测试锁定行为，如上游数据变更再显式补充兼容层
- 依赖切换后遗漏构建配置或文档引用 -> 在实现任务中包含依赖清理与验证步骤，确保仓库中不再残留运行路径上的 `node-emoji`
