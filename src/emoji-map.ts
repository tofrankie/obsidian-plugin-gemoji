import { get } from 'node-emoji'

const ALIASES = new Map<string, string>([['satisfied', '😆']])

export function getEmoji(shortcodeName: string): string | undefined {
  return ALIASES.get(shortcodeName) ?? get(shortcodeName)
}
