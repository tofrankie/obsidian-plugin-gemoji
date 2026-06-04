import { describe, expect, it } from 'vitest'

import { replaceEmojiShortcodes } from '../src/emoji'

describe('replaceEmojiShortcodes', () => {
  it('renders a single supported shortcode', () => {
    expect(replaceEmojiShortcodes('Hello :smile:')).toBe('Hello 😄')
  })

  it('renders adjacent supported shortcodes', () => {
    expect(replaceEmojiShortcodes(':dog::+1:')).toBe('🐶👍')
  })

  it('renders hyphen and underscore shortcode names', () => {
    expect(replaceEmojiShortcodes(':+1: :-1: :slightly_smiling_face:')).toBe('👍 👎 🙂')
  })

  it('leaves unknown shortcode-like text unchanged', () => {
    expect(replaceEmojiShortcodes(':not_a_real_emoji:')).toBe(':not_a_real_emoji:')
  })

  it('leaves malformed shortcode-like text unchanged', () => {
    expect(replaceEmojiShortcodes(':smile smile:')).toBe(':smile smile:')
  })

  it('supports common GitHub emoji names', () => {
    expect(replaceEmojiShortcodes(':heart: :rocket: :white_check_mark:')).toBe('❤️ 🚀 ✅')
  })

  it('supports expected aliases', () => {
    expect(replaceEmojiShortcodes(':laughing: :satisfied:')).toBe('😆 😆')
  })

  it('does not convert plain emoticons', () => {
    expect(replaceEmojiShortcodes(':-) :)')).toBe(':-) :)')
  })

  it('does not convert ordinary colon text', () => {
    expect(replaceEmojiShortcodes('time: 10:30')).toBe('time: 10:30')
  })
})
