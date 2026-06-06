# Gemoji for Obsidian

> [English](./README.md) | 简体中文

Gemoji（GitHub Emoji）用于在 Obsidian 阅读模式中渲染 emoji shortcodes。

## 功能

- 将支持的 shortcodes 渲染为 Unicode emoji，例如 `:smile:` 😄、`:rocket:` 🚀、`:+1:` 👍 和 `:white_check_mark:` ✅
- 保留 markdown 源内容不变

## 预览

<details>
<summary>截图</summary>

![](./images/light-mode.png)
![](./images/dark-mode.png)

</details>

## 范围

本插件面向 Obsidian 阅读模式，以及 Obsidian markdown post processors 支持的 markdown 渲染上下文。目前不会在实时阅览或源码模式中渲染 emoji shortcodes。

## 安装方式

本插件可在 Obsidian Community Plugins [商店](https://community.obsidian.md/plugins/gemoji)中安装。

<details>
<summary>手动安装</summary>

1. 从最新的 GitHub [release](https://github.com/tofrankie/obsidian-plugin-gemoji/releases) 下载 `main.js` 和 `manifest.json`
2. 创建 `/your_vault/.obsidian/plugins/gemoji/`
3. 将下载的文件放入该目录
4. 在 Obsidian 中进入 设置 -> 第三方插件 -> 已安装插件 -> Gemoji -> 开启，然后重启 Obsidian

</details>

## 相关推荐

如果你喜欢 GitHub 的 Markdown 渲染风格，也可以试试这款适用于 Obsidian 的 [GitHub Flavored Markdown Theme](https://community.obsidian.md/themes/github-flavored-markdown-theme)。

## 致谢 ❤️

- [gemoji](https://github.com/wooorm/gemoji) 提供 emoji shortcode 数据
- [emoji-cheat-sheet](https://github.com/ikatyang/emoji-cheat-sheet) 提供 GitHub emoji 对照表

## 许可证

MIT License © [Frankie](https://github.com/tofrankie)
