import { defineConfig } from 'tsdown'

export default defineConfig({
  clean: ['main.js'],
  dts: false,
  entry: ['src/main.ts'],
  deps: {
    alwaysBundle: ['gemoji'],
    neverBundle: ['obsidian'],
    onlyBundle: ['gemoji'],
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
