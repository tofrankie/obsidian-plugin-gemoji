## Requirements

### Requirement: 在 markdown 渲染上下文中渲染受支持的 emoji shortcode

插件 SHALL 在 Obsidian Reading mode 和受支持的 markdown 渲染上下文中，将受支持的 GitHub 风格 emoji shortcode 替换为对应 Unicode emoji。

#### Scenario: 渲染单个受支持 shortcode

- **WHEN** 渲染的 markdown 包含 `Hello :smile:`
- **THEN** 预览输出包含 `Hello 😄`

#### Scenario: 渲染相邻的受支持 shortcode

- **WHEN** 渲染的 markdown 包含 `:dog::+1:`
- **THEN** 预览输出包含 `🐶👍`

#### Scenario: 渲染包含连字符和下划线的 shortcode 名称

- **WHEN** 渲染的 markdown 包含 `:+1:`、`:-1:` 或 `:slightly_smiling_face:` 这类受支持 shortcode 名称
- **THEN** 每个受支持 shortcode 都被替换为其映射的 Unicode emoji

### Requirement: 保留 markdown 源内容

插件 SHALL 只在 markdown 渲染阶段执行 emoji shortcode 替换，并且 MUST NOT 修改已存储的 markdown 源内容。

#### Scenario: 预览替换不编辑源文件

- **WHEN** 包含 `Ship it :rocket:` 的笔记在阅读模式或受支持 markdown 渲染上下文中渲染
- **THEN** 预览输出显示 rocket emoji
- **THEN** 笔记源内容仍保持为 `Ship it :rocket:`

### Requirement: 不支持的 shortcode-like 文本保持不变

插件 SHALL 在渲染输出中保留无法识别、不受支持或格式错误的 shortcode-like 文本。

#### Scenario: 未知 shortcode 仍可见

- **WHEN** 渲染的 markdown 包含 `:not_a_real_emoji:`
- **THEN** 预览输出仍包含 `:not_a_real_emoji:`

#### Scenario: 格式错误 shortcode 仍可见

- **WHEN** 渲染的 markdown 包含 `:smile` 或 `smile:`
- **THEN** 预览输出按原样保留这些文本

### Requirement: 使用稳定的 gemoji 兼容 shortcode 目录

插件 SHALL 基于与常见 GitHub emoji 名称对齐的 gemoji 兼容来源，定义受支持的 shortcode 目录。

#### Scenario: 支持常见 GitHub emoji 名称

- **WHEN** 渲染的 markdown 包含 `:heart:`、`:rocket:`、`:white_check_mark:` 这类常见 GitHub emoji shortcode
- **THEN** 每个 shortcode 都被替换为匹配的 Unicode emoji

#### Scenario: alias 名称解析到同一个 emoji

- **WHEN** 渲染的 markdown 包含 `:laughing:` 和 `:satisfied:` 这类受支持 alias shortcode
- **THEN** 每个 alias 都被替换为该 alias 对应的 Unicode emoji

### Requirement: 避免替换非 shortcode markdown 构造

插件 SHALL 将替换范围限制为完整且受支持的 shortcode token，并且 MUST NOT 将任意标点或 emoticon 重新解释为 emoji shortcode。

#### Scenario: 普通 emoticon 不转换

- **WHEN** 渲染的 markdown 包含 `:-)` 或 `:)`
- **THEN** 预览输出按原样保留 emoticon 文本

#### Scenario: 普通冒号文本不转换

- **WHEN** 渲染的 markdown 包含 `time: 10:30` 这类普通文本
- **THEN** 预览输出按原样保留该普通文本

### Requirement: 支持 Obsidian markdown 渲染上下文

插件 SHALL 在 Obsidian 可使用插件 markdown 处理能力的渲染上下文中应用 emoji shortcode 渲染。

#### Scenario: 阅读视图渲染受支持 shortcode

- **WHEN** 笔记在 Obsidian 阅读视图打开，且内容包含受支持 emoji shortcode
- **THEN** 可见 markdown 内容中的这些 shortcode 被渲染为 Unicode emoji

#### Scenario: 嵌入渲染的 markdown 使用相同行为

- **WHEN** Obsidian 通过插件支持的 markdown 渲染 API 渲染 markdown 内容
- **THEN** 该渲染内容中的受支持 emoji shortcode 使用相同替换行为
