import type { MarkdownPostProcessorContext } from 'obsidian'

import { replaceEmojiShortcodes } from './emoji'

const SKIPPED_TAGS = new Set(['CODE', 'PRE', 'SCRIPT', 'STYLE', 'TEXTAREA'])
const SKIPPED_SELECTORS = ['.cm-editor', '.cm-line', '.HyperMD-codeblock']

export function renderEmojiShortcodes(el: HTMLElement, _ctx?: MarkdownPostProcessorContext): void {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.textContent?.includes(':')) {
        return NodeFilter.FILTER_REJECT
      }

      if (shouldSkipNode(node)) {
        return NodeFilter.FILTER_REJECT
      }

      return NodeFilter.FILTER_ACCEPT
    },
  })

  const textNodes: Text[] = []
  let node = walker.nextNode()
  while (node) {
    textNodes.push(node as Text)
    node = walker.nextNode()
  }

  for (const textNode of textNodes) {
    replaceTextNode(textNode)
  }
}

function replaceTextNode(textNode: Text): void {
  const original = textNode.nodeValue ?? ''
  const replaced = replaceEmojiShortcodes(original)

  if (replaced === original) {
    return
  }

  textNode.replaceWith(document.createTextNode(replaced))
}

function shouldSkipNode(node: Node): boolean {
  const parent = node.parentElement

  if (!parent) {
    return true
  }

  if (parent.closest(SKIPPED_SELECTORS.join(','))) {
    return true
  }

  for (let element: Element | null = parent; element; element = element.parentElement) {
    if (SKIPPED_TAGS.has(element.tagName)) {
      return true
    }
  }

  return false
}
