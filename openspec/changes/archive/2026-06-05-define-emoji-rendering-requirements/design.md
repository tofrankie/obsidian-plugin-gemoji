## Context

本仓库实现一个 Obsidian 社区插件，用于在 Obsidian Reading mode 和受支持 markdown 渲染上下文中渲染 GitHub 风格 emoji shortcode。需求已经确认，实施阶段需要补齐插件源码、构建脚本、测试、文档与发布所需元数据。

emoji shortcode 行为采用以下约束：

- 支持 `:+1:`、`:-1:`、`:[\w-]+:` 这类 shortcode。
- 未知匹配保持不变。
- shortcode 目录需要兼容常见 GitHub/gemoji 名称和 alias。

实施前仓库状态：

- `package.json` 只有基础元数据，没有构建、测试、lint 脚本。
- 尚无 Obsidian 插件入口文件、manifest、样式或测试。
- 项目使用 ESM，并声明 `pnpm@10.33.4`。

Obsidian 官方插件开发文档确认了以下开发约束：

- 插件需要放在测试 vault 的 `.obsidian/plugins/<plugin-id>/` 下供 Obsidian 加载。
- 构建后插件目录需要包含 `main.js` 和 `manifest.json`。
- `manifest.json` 描述插件 `id`、`name`、`description` 等元数据；修改 manifest 后需要重启 Obsidian。
- 插件源码通过 Obsidian TypeScript API 开发，入口类继承 `Plugin`，并在 `onload()` 中注册功能。

Obsidian 官方社区提交文档确认了以下发布约束：

- 提交前仓库根目录需要有 `README.md`、`LICENSE` 和 `manifest.json`。
- GitHub Release 的 tag 必须与 `manifest.json.version` 完全一致，版本号格式为 `x.y.z`。
- GitHub Release 需要把 `main.js`、`manifest.json` 作为单独附件上传；如果插件有样式，则同时上传 `styles.css`。
- 首次提交需要向 `obsidianmd/obsidian-releases` 的 `community-plugins.json` 添加条目；条目的 `id`、`name`、`author`、`description` 应与 `manifest.json` 对应字段一致。
- 插件 `id` 必须唯一，不能包含 `obsidian`。
- `versions.json` 用于在提高 `minAppVersion` 时提供旧 Obsidian 版本的 fallback；不需要列出每个版本，但应在改变 `minAppVersion` 时维护。
- 发布评审前需要遵守官方 Developer policies 和 Submission requirements，尤其是依赖、安全、移动端兼容、性能和 README disclosure。

发布 Release 流程采用以下约束：

- 使用 `.github/workflows/release.yml`，支持推送任意 tag 触发，也支持 `workflow_dispatch` 手动输入版本号。
- workflow 需要 `permissions.contents: write`，使用 `GITHUB_TOKEN` 和 GitHub CLI 创建或更新 release。
- release notes 从 `CHANGELOG.md` 中提取，要求存在 `## <version>` 小节。
- 如果 release 已存在，则进入 recovery mode，更新 release notes 并用 `--clobber` 覆盖附件。
- 本插件 workflow 需要在创建 release 前执行 `pnpm install --frozen-lockfile`、`pnpm test`、`pnpm typecheck`、`pnpm build`，然后上传 `main.js`、`manifest.json` 和可选 `styles.css`。

本插件 manifest 当前采用：

```json
{
  "id": "gemoji",
  "name": "Gemoji",
  "version": "1.0.0",
  "minAppVersion": "1.0.0",
  "description": "Render emoji shortcodes in reading mode.",
  "author": "Frankie",
  "authorUrl": "https://github.com/tofrankie",
  "fundingUrl": {
    "PayPal": "https://paypal.me/tofrankie"
  },
  "isDesktopOnly": false
}
```

说明：

- 插件 manifest 必须包含社区插件提交所需的 `id` 和 `description`。
- `id` 建议使用 `gemoji`，避免包含 `obsidian`，并与测试 vault 插件目录 `.obsidian/plugins/gemoji/` 保持一致。
- `name` 使用 `Gemoji`，社区列表中的显示名称保持简短。
- `version` 初始为 `1.0.0`；后续 GitHub release tag 必须与该值完全一致。
- `minAppVersion` 沿用 `1.0.0`，除非实现时使用了更高版本才提供的 Obsidian API。

## Goals / Non-Goals

**Goals:**

- 实现一个可构建的 TypeScript Obsidian 插件。
- 在 Obsidian Reading mode 和受支持 markdown 渲染上下文中将受支持的 `:emoji:` shortcode 转换为 Unicode emoji。
- 精确保留用户写入的 markdown 源内容。
- 使用 gemoji 兼容 shortcode 目录，使常见 GitHub 名称和 alias 符合预期。
- 将 shortcode 替换逻辑做成独立纯函数，方便单元测试。
- 提供覆盖需求场景的自动化测试和最小手工验收说明。

**Non-Goals:**

- 不在编辑器源码中直接改写 markdown。
- 不转换 `:-)` 或 `:)` 这类普通 emoticon。
- 不定义用户自定义 emoji，也不支持基于远程图片的 GitHub custom emoji。
- 首个版本不提供设置页、可访问性 wrapper 或渲染后额外空格选项。

## Decisions

1. 使用 TypeScript + Obsidian 插件标准入口。

   入口文件使用 `src/main.ts`，导出继承 `Plugin` 的插件类，并通过 `manifest.json` 描述插件元数据。构建产物输出到仓库根目录的 `main.js`，与 Obsidian 社区插件约定保持一致。

2. 使用 Obsidian `registerMarkdownPostProcessor` 接入渲染阶段。

   插件加载时调用 `this.registerMarkdownPostProcessor((el, ctx) => { ... })` 注册 markdown post processor，只处理 Obsidian 已渲染出的 markdown DOM。官方 API 说明该方法用于改变 reading mode 中文档的显示效果，这正好满足“渲染时替换、不修改源文件”的需求。

3. DOM 处理只遍历安全文本节点。

   post processor 应遍历容器内的文本节点，跳过 `CODE`、`PRE`、`SCRIPT`、`STYLE`、`TEXTAREA` 以及 `.cm-*` 等明显不应处理的区域。包含 shortcode 的文本节点被拆分为普通文本节点和 emoji 文本节点；没有命中时不改动 DOM。

4. shortcode 替换核心使用纯函数。

   在 `src/emoji.ts` 中实现 `replaceEmojiShortcodes(input: string): string` 和必要的辅助函数。匹配规则覆盖 `:+1:`、`:-1:` 和 `:[A-Za-z0-9_-]+:`；只有映射表中存在的 shortcode 才替换，未知或格式错误文本保持不变。

5. emoji 映射使用 `node-emoji` 并补充必要 alias。

   `src/emoji-map.ts` 对 `node-emoji` 做稳定封装，并补充 `satisfied -> 😆` 等当前依赖缺失但需求需要的 alias。`node-emoji` 放在 `devDependencies` 中作为构建期依赖，通过 tsdown 打包进 `main.js`，Obsidian 运行时不需要安装 `node_modules`。

6. 构建使用 tsdown + TypeScript，测试使用 Vitest。

   `tsdown` 负责将 TypeScript 入口打包为 Obsidian 可加载的根目录 `main.js`，并只把 `obsidian` 保留为外部依赖。TypeScript 使用 project references 分层检查：`tsconfig.app.json` 负责 `src/`，`tsconfig.test.json` 负责 `tests/`，`tsconfig.node.json` 负责 `tsdown.config.ts`。`pnpm typecheck` 运行 `tsc --build --noEmit`。Vitest 用于验证纯函数和 DOM post processor 行为，测试不依赖真实 Obsidian 启动。

7. 首个版本保持 Unicode-only。

   不生成 HTML wrapper，不设置 `role`/`aria-label`，也不添加额外空格。这样实现更小，行为更接近需求确认范围；可访问性增强可作为后续 capability。

8. 首个版本不覆盖 Live Preview 编辑器内渲染。

   `registerMarkdownPostProcessor` 面向 reading mode 渲染结果。若后续需要在 Live Preview 或源码编辑器中也显示 emoji，需要追加 CodeMirror 6 extension/decoration 方案；这不属于当前已确认需求。

## Implementation Structure

建议文件结构：

```text
manifest.json
versions.json
CHANGELOG.md
README.md
README.zh_CN.md
LICENSE
.github/workflows/release.yml
scripts/
  deploy-vault.js
src/
  main.ts
  emoji.ts
  emoji-map.ts
  markdown-post-processor.ts
tests/
  emoji.test.ts
  markdown-post-processor.test.ts
tsconfig.json
tsconfig.app.json
tsconfig.test.json
tsconfig.node.json
tsdown.config.ts
```

核心职责：

- `src/main.ts`: 导入 `Plugin`，导出插件类；在 `onload` 中注册 markdown post processor。
- `src/emoji.ts`: shortcode 匹配与纯文本替换。
- `src/emoji-map.ts`: shortcode 到 Unicode emoji 的映射数据，或对外部数据源做稳定封装。
- `src/markdown-post-processor.ts`: DOM 文本节点遍历、跳过规则、节点拆分与替换。
- `tests/emoji.test.ts`: 覆盖 spec 中单个 shortcode、相邻 shortcode、alias、未知文本、格式错误文本、emoticon 和普通冒号文本。
- `tests/markdown-post-processor.test.ts`: 覆盖 DOM 替换、代码块跳过、无命中文本不改动。
- `versions.json`: 记录插件版本与最低 Obsidian 版本的对应关系；初始版本可包含 `manifest.json.version` 到 `manifest.json.minAppVersion` 的映射，后续只在 `minAppVersion` 变化时更新。
- `CHANGELOG.md`: 每个可发布版本包含 `## <version>` 小节，供 release workflow 提取 notes。
- `scripts/deploy-vault.js`: 将 `main.js` 和 `manifest.json` 复制到 `vault/.obsidian/plugins/gemoji/`，方便本地 Obsidian vault 验证。
- `.github/workflows/release.yml`: 基于 tag 或手动输入版本创建/更新 GitHub release，并上传 Obsidian 社区插件要求的附件。

## Validation

自动化验证：

- `pnpm test`: 运行 Vitest 单元测试。
- `pnpm typecheck`: 使用 `tsc --build --noEmit` 按 TypeScript project references 检查类型。
- `pnpm build:plugin`: 使用 tsdown 生成 Obsidian 可加载的 `main.js`。
- `pnpm deploy:vault`: 将 `main.js` 与 `manifest.json` 复制到仓库内测试 vault 的 `vault/.obsidian/plugins/gemoji/`。
- `pnpm build`: 依次运行 `build:plugin` 和 `deploy:vault`。
- 检查根目录存在 `manifest.json` 和 `main.js`，且 `manifest.json.id` 与测试 vault 插件目录名一致。
- 检查 `main.js` 是 release 构建产物，不作为源码常规提交内容；GitHub Release 附件必须单独包含 `main.js` 和 `manifest.json`。

手工验收：

- 运行 `pnpm build`，将 `manifest.json`、`main.js` 部署到仓库内测试 vault 的 `vault/.obsidian/plugins/gemoji/`。
- 在 Obsidian 中启用插件。
- 修改 `manifest.json` 后重启 Obsidian，再重新启用或热重载插件代码。
- 打开包含以下内容的测试笔记：

````md
Hello :smile:
:dog::+1:
Ship it :rocket:
:not_a_real_emoji:
:-)
time: 10:30

`code :smile:`

```text
block :rocket:
```
````

- 阅读视图中确认受支持 shortcode 显示为 emoji，未知 shortcode、emoticon、普通冒号文本和代码区域保持原样。
- 返回源码模式确认 markdown 源文本未被修改。

发布验收：

- `README.md` 和 `README.zh_CN.md` 说明插件用途、安装方式、支持范围、不支持范围和数据来源。
- `CHANGELOG.md` 包含与当前 `manifest.json.version` 一致的 `## <version>` 小节。
- `LICENSE` 存在且 license 与依赖使用方式兼容。
- `manifest.json` 包含必填字段 `id`、`name`、`version`、`minAppVersion`、`description`、`author`，且版本号为 `x.y.z`。
- `manifest.json` 使用默认提交信息：`id` 为 `gemoji`，`name` 为 `Gemoji`，`author` 为 `Frankie`，`authorUrl` 为 `https://github.com/tofrankie`，`fundingUrl.PayPal` 为 `https://paypal.me/tofrankie`。
- `versions.json` 与当前 `manifest.json.version`/`minAppVersion` 保持一致，后续提高 `minAppVersion` 时同步维护。
- GitHub release tag 与 `manifest.json.version` 完全一致。
- GitHub release 附件包含 `main.js`、`manifest.json`，如果存在样式则包含 `styles.css`。
- GitHub workflow 能在 tag push 或 `workflow_dispatch` 时构建插件、抽取 changelog、创建或更新 release。
- 提交 `community-plugins.json` 前搜索确认插件 `id` 未被占用且不包含 `obsidian`。
- PR 条目的 `id`、`name`、`author`、`description` 与 `manifest.json` 对齐，`repo` 指向 `tofrankie/obsidian-plugin-gemoji`。

## Risks / Trade-offs

- emoji 数据源 license 或体积不合适 -> 实现前验证依赖 license、导出格式和打包大小；必要时改用生成的本地映射。
- Obsidian markdown post processor 的 DOM 覆盖范围与预期不同 -> 手工验收覆盖 Reading mode 和 Obsidian 渲染 API 产生的内容。
- DOM 文本节点替换可能影响代码块或插件生成的特殊区域 -> 实现跳过规则并用测试覆盖 `code/pre` 场景。
- alias 数据源不完整 -> 用需求中的 alias fixture 固定行为，缺失时补充映射或更换数据源。
- 大文档遍历成本可能上升 -> 只处理当前 post processor 容器，先用文本包含 `:` 的快速判断跳过无关节点。
- 社区提交因 release 附件、版本号或 manifest 字段不一致失败 -> 发布前用 checklist 检查 `manifest.json.version`、Git tag、release assets 和 `community-plugins.json` 条目。
- release workflow 找不到 changelog 小节导致失败 -> 发布前确认 `CHANGELOG.md` 存在 `## <version>`，且版本与 tag/manifest 完全一致。
- 移动端兼容风险 -> 当前功能不需要 Node.js、Electron、文件系统或网络 API；实现时避免顶层导入这些 API。`node-emoji` 已打包进 `main.js`，运行时只外部引用 Obsidian API。

## Open Questions

- 无。当前实现选择 `node-emoji` 作为构建期打包依赖，并通过本地封装补充 alias。
