import { nameToEmoji } from 'gemoji'

const SIGN_SHORTCODE_PATTERN = /:[+-]1:/g
const NAMED_SHORTCODE_PATTERN = /:[\w-]+:/g

export function replaceEmojiShortcodes(input: string): string {
  return replaceNamedShortcodes(replaceSignShortcodes(input))
}

function replaceSignShortcodes(input: string): string {
  return input.replaceAll(SIGN_SHORTCODE_PATTERN, match => {
    const emoji = nameToEmoji[match.slice(1, -1)]

    return emoji ?? match
  })
}

function replaceNamedShortcodes(input: string): string {
  return input.replaceAll(NAMED_SHORTCODE_PATTERN, match => {
    const emoji = nameToEmoji[match.slice(1, -1)]

    return emoji ?? match
  })
}
