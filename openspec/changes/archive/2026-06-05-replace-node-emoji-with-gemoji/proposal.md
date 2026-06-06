## Why

当前插件仍通过 `node-emoji` 查询 shortcode 对应的 Unicode emoji，但本仓库的目标和已有需求已经围绕 gemoji 兼容目录展开。为避免继续依赖不再匹配当前目标的数据接入方式，需要将 emoji 数据来源切换为 [`wooorm/gemoji`](https://github.com/wooorm/gemoji)，同时保持现有渲染行为与测试预期不变。

## What Changes

- 将 emoji shortcode 映射的底层依赖从 `node-emoji` 替换为 `gemoji`
- 保持现有 `replaceEmojiShortcodes`、markdown post processor 和用户可见渲染行为不变
- 在映射层直接复用 `gemoji` 提供的 shortcode 与 alias 数据
- 更新测试与构建配置，确保仓库不再依赖 `node-emoji`

## Capabilities

### New Capabilities

- 无

### Modified Capabilities

- `emoji-shortcode-rendering`: 将 shortcode 目录的数据来源收敛为 `gemoji`，同时保持现有支持范围、alias 结果和渲染行为不变

## Impact

- 影响 `src/emoji.ts` 中的 shortcode 查询接入与相关测试
- 影响 `package.json`、锁文件和打包配置中的依赖声明
- 不引入新的用户可见能力，也不改变 markdown 渲染逻辑或源内容处理方式
