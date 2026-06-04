# Gemoji for Obsidian

> [English](./README.md) | 简体中文

在 Obsidian 阅读模式中渲染 emoji shortcodes。

## 功能

- 将支持的 shortcodes 渲染为 Unicode emoji，例如 `:smile:` :smile:、`:rocket:` :rocket:、`:+1:` :+1: 和 `:white_check_mark:` :white_check_mark:
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

## 致谢 ❤️

- [node-emoji](https://github.com/omnidan/node-emoji) 用于 emoji shortcode 查询
- [emoji-cheat-sheet](https://github.com/ikatyang/emoji-cheat-sheet) 提供 GitHub emoji 对照表

## 许可证

MIT License © [Frankie](https://github.com/tofrankie)
