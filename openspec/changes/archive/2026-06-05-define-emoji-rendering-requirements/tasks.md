## 1. 项目脚手架

- [x] 1.1 添加 Obsidian 插件必需的 `manifest.json`，默认使用 `id: gemoji`、`name: Gemoji`、`version: 1.0.0`、`minAppVersion: 1.0.0`、`author: Frankie`、`authorUrl: https://github.com/tofrankie`、`fundingUrl.PayPal: https://paypal.me/tofrankie`，并补齐 `description`。
- [x] 1.2 添加 `versions.json`，记录当前插件版本与最低 Obsidian 版本的对应关系。
- [x] 1.3 添加 TypeScript project references 配置，包括 `tsconfig.app.json`、`tsconfig.test.json`、`tsconfig.node.json` 和 `tsdown.config.ts`，产物输出为根目录 `main.js`。
- [x] 1.4 更新 `.gitignore`，确保 `main.js` 等构建产物不作为源码常规提交内容。
- [x] 1.5 更新 `package.json`，加入 `build`、`build:plugin`、`deploy:vault`、`dev`、`typecheck`、`test` 脚本，以及 `obsidian`、`tsdown`、`typescript`、`vitest` 等所需开发依赖。
- [x] 1.6 建立 `src/` 和 `tests/` 目录结构。
- [x] 1.7 添加 `CHANGELOG.md`，首个版本包含 `## 1.0.0` 小节。
- [x] 1.8 添加 `.github/workflows/release.yml`，支持 tag/manual release 流程。
- [x] 1.9 添加构建后部署到仓库内测试 vault 的脚本，将 `main.js` 和 `manifest.json` 复制到 `vault/.obsidian/plugins/gemoji/`。

## 2. Emoji 数据与核心替换逻辑

- [x] 2.1 评估并选择 `node-emoji` 作为 gemoji 兼容 emoji shortcode 数据源，确认 license、alias 覆盖和打包方式；`node-emoji` 作为构建期依赖打包进 `main.js`。
- [x] 2.2 实现 `src/emoji-map.ts`，提供稳定的 shortcode 到 Unicode emoji 映射。
- [x] 2.3 实现 `src/emoji.ts` 中的 `replaceEmojiShortcodes(input: string): string`。
- [x] 2.4 确保匹配规则支持 `:+1:`、`:-1:`、`:[A-Za-z0-9_-]+:`，且未知或格式错误文本保持不变。

## 3. Obsidian markdown 渲染接入

- [x] 3.1 实现 `src/markdown-post-processor.ts`，遍历渲染容器中的文本节点。
- [x] 3.2 跳过 `CODE`、`PRE`、`SCRIPT`、`STYLE`、`TEXTAREA` 和明显不应处理的编辑器/代码区域。
- [x] 3.3 将包含受支持 shortcode 的文本节点拆分并替换为 emoji 文本节点。
- [x] 3.4 实现 `src/main.ts`，导入 Obsidian `Plugin`，在插件 `onload` 中注册 markdown post processor。

## 4. 自动化测试

- [x] 4.1 添加 `tests/emoji.test.ts`，覆盖单个 shortcode、相邻 shortcode、连字符/下划线 shortcode、alias、未知 shortcode、格式错误 shortcode、emoticon 和普通冒号文本。
- [x] 4.2 添加 `tests/markdown-post-processor.test.ts`，覆盖 DOM 文本替换、代码区域跳过和无命中文本不改动。
- [x] 4.3 运行并修复 `pnpm test`、`pnpm typecheck`、`pnpm build` 的问题。

## 5. 文档与验收

- [x] 5.1 更新 `README.md` 和 `README.zh_CN.md`，说明插件功能、安装方式、支持范围和不支持范围。
- [x] 5.2 在 README 记录 emoji 数据来源、license 注意事项，以及必要的社区提交 disclosure。
- [x] 5.3 在仓库内 `vault/` 测试 vault 中启用插件，按 `design.md` 的手工验收样例验证阅读视图行为。
- [x] 5.4 确认 `manifest.json.id` 为 `gemoji`，测试 vault 插件目录为 `vault/.obsidian/plugins/gemoji/`，并在修改 manifest 后重启 Obsidian。
- [x] 5.5 确认源码模式中的 markdown 源文本不会被插件修改。

## 6. 社区发布准备

- [x] 6.1 确认仓库根目录存在 `README.md`、`LICENSE`、`manifest.json`、`versions.json` 和 `CHANGELOG.md`。
- [x] 6.2 确认 `manifest.json` 包含 `id`、`name`、`version`、`minAppVersion`、`description`、`author`、`authorUrl`、`fundingUrl`，且 `version` 使用 `x.y.z` 格式。
- [x] 6.3 搜索 `obsidianmd/obsidian-releases` 的 `community-plugins.json`，确认插件 `id` `gemoji` 未被占用且不包含 `obsidian`。
- [x] 6.4 确认 `CHANGELOG.md` 包含与 `manifest.json.version` 一致的 `## <version>` 小节。
- [x] 6.5 推送与 `manifest.json.version` 完全一致的 Git tag，或使用 `workflow_dispatch` 输入同一版本号。
- [x] 6.6 确认 GitHub workflow 运行 `pnpm install --frozen-lockfile`、`pnpm test`、`pnpm typecheck`、`pnpm build` 后创建或更新 release。
- [x] 6.7 确认 GitHub release 附件包含 `main.js`、`manifest.json`；如果后续新增样式，则同时包含 `styles.css`。
- [x] 6.8 向 `community-plugins.json` 添加插件条目，确保 `id`、`name`、`author`、`description` 与 `manifest.json` 对齐，`repo` 指向 `tofrankie/obsidian-plugin-gemoji`。
- [x] 6.9 提交社区插件 PR 后检查自动校验标签；若出现 `Validation failed`，修复问题并更新同一个 PR。
