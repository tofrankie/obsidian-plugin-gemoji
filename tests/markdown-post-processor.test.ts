import { JSDOM } from 'jsdom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { renderEmojiShortcodes } from '../src/markdown-post-processor'

describe('renderEmojiShortcodes', () => {
  let previousDocument: Document | undefined
  let previousNodeFilter: typeof NodeFilter | undefined

  beforeEach(() => {
    previousDocument = globalThis.document
    previousNodeFilter = globalThis.NodeFilter

    const dom = new JSDOM('<!doctype html><html><body></body></html>')
    globalThis.document = dom.window.document
    globalThis.NodeFilter = dom.window.NodeFilter
  })

  afterEach(() => {
    globalThis.document = previousDocument as Document
    globalThis.NodeFilter = previousNodeFilter as typeof NodeFilter
  })

  it('renders shortcodes in text nodes', () => {
    const el = document.createElement('div')
    el.textContent = 'Hello :smile:'

    renderEmojiShortcodes(el)

    expect(el.textContent).toBe('Hello 😄')
  })

  it('leaves code regions unchanged', () => {
    const el = document.createElement('div')
    el.innerHTML = '<p>:rocket:</p><pre><code>:rocket:</code></pre><code>:smile:</code>'

    renderEmojiShortcodes(el)

    expect(el.innerHTML).toBe('<p>🚀</p><pre><code>:rocket:</code></pre><code>:smile:</code>')
  })

  it('leaves text without supported shortcodes unchanged', () => {
    const el = document.createElement('div')
    el.textContent = 'time: 10:30 and :not_a_real_emoji:'

    renderEmojiShortcodes(el)

    expect(el.textContent).toBe('time: 10:30 and :not_a_real_emoji:')
  })

  it('skips CodeMirror regions', () => {
    const el = document.createElement('div')
    el.innerHTML = '<div class="cm-editor"><span>:smile:</span></div><p>:smile:</p>'

    renderEmojiShortcodes(el)

    expect(el.innerHTML).toBe('<div class="cm-editor"><span>:smile:</span></div><p>😄</p>')
  })
})
