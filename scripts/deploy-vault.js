import { copyFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const pluginDir = resolve('vault/.obsidian/plugins/gemoji')

await mkdir(pluginDir, { recursive: true })
await Promise.all([
  copyFile('main.js', resolve(pluginDir, 'main.js')),
  copyFile('manifest.json', resolve(pluginDir, 'manifest.json')),
])

console.log(`Deployed Gemoji to ${pluginDir}`)
