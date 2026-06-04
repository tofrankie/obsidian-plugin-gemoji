import { defineConfig } from '@tofrankie/eslint'

export default defineConfig({
  ignores: ['dist', 'main.js', 'vault/.obsidian/**'],
  typescript: true,
})
