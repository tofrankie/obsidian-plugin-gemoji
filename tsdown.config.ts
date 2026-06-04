import { defineConfig } from 'tsdown'

export default defineConfig({
  clean: ['main.js'],
  dts: false,
  entry: ['src/main.ts'],
  deps: {
    alwaysBundle: ['node-emoji'],
    neverBundle: ['obsidian'],
    onlyBundle: [
      '@sindresorhus/is',
      'char-regex',
      'emojilib',
      'node-emoji',
      'skin-tone',
      'unicode-emoji-modifier-base',
    ],
  },
  format: 'cjs',
  minify: false,
  outDir: '.',
  outputOptions: {
    entryFileNames: 'main.js',
  },
  platform: 'browser',
  sourcemap: false,
})
