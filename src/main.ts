import { Plugin } from 'obsidian'

import { renderEmojiShortcodes } from './markdown-post-processor'

export default class GemojiPlugin extends Plugin {
  override onload(): void {
    this.registerMarkdownPostProcessor(renderEmojiShortcodes)
  }
}
