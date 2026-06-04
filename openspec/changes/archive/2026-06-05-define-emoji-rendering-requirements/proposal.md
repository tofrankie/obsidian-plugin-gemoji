## Why

Obsidian 在渲染 markdown 时，默认会把 `:smile:` 这类 GitHub 风格 emoji shortcode 当作普通文本显示，除非用户通过其他插件或外部流程先做转换。本变更用于定义并实现一个 Obsidian 插件：在不修改 markdown 源内容的前提下，将受支持的 `:emoji:` shortcode 渲染为对应的 Unicode emoji，让已有笔记在阅读模式中更易读。

## What Changes

- 新增 markdown 渲染能力：在 Obsidian 渲染 markdown 时，将可识别的 emoji shortcode 替换为对应 Unicode emoji。
- 保留原始 markdown 源文本；替换只发生在渲染阶段。
- 明确不支持或格式错误的 shortcode-like 文本如何处理，避免普通 markdown 内容被意外改写。
- 建立兼容常见 GitHub/gemoji 名称的 emoji shortcode 数据集。
- 使用 TypeScript、tsdown 和 Vitest 补齐实现、构建、测试、文档和发布准备。

## Capabilities

### New Capabilities

- `emoji-shortcode-rendering`: 在 Obsidian Reading mode 和受支持 markdown 渲染上下文中，将受支持的 `:emoji:` shortcode 渲染为 Unicode emoji，同时保留 markdown 源内容。

### Modified Capabilities

- 无。

## Impact

- 后续会影响 Obsidian 插件运行时接入方式，尤其是 markdown post processor 或其他渲染扩展点。
- 需要一个来源清晰、兼容 gemoji 风格的 emoji shortcode 映射。
- 预期没有破坏性变更，因为 markdown 源文件不会被修改，不受支持的 shortcode 仍按原样显示。
