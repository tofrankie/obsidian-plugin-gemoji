## MODIFIED Requirements

### Requirement: 使用稳定的 gemoji 兼容 shortcode 目录

插件 SHALL 基于 [`wooorm/gemoji`](https://github.com/wooorm/gemoji) 数据集及其原生 alias 映射，定义受支持的 shortcode 目录，并保持与现有 GitHub 风格 emoji shortcode 渲染行为一致。

#### Scenario: 支持常见 GitHub emoji 名称

- **WHEN** 渲染的 markdown 包含 `:heart:`、`:rocket:`、`:white_check_mark:` 这类常见 GitHub emoji shortcode
- **THEN** 每个 shortcode 都被替换为匹配的 Unicode emoji

#### Scenario: alias 名称解析到同一个 emoji

- **WHEN** 渲染的 markdown 包含 `:laughing:` 和 `:satisfied:` 这类受支持 alias shortcode
- **THEN** 每个 alias 都被替换为该 alias 对应的 Unicode emoji
