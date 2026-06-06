import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const pluginDir = resolve('vault/.obsidian/plugins/gemoji')

main()

async function main() {
  const version = await readPackageVersion()

  await updateManifestVersion(version)
  await deployPluginFiles()

  console.log(`Deployed Gemoji ${version} to ${pluginDir}`)
}

async function readPackageVersion() {
  const packageJson = await readJson('package.json')
  return packageJson.version
}

async function updateManifestVersion(version) {
  const manifest = await readJson('manifest.json')
  manifest.version = version

  await writeJson('manifest.json', manifest)
}

async function deployPluginFiles() {
  await mkdir(pluginDir, { recursive: true })

  await Promise.all([
    copyFile('main.js', resolve(pluginDir, 'main.js')),
    copyFile('manifest.json', resolve(pluginDir, 'manifest.json')),
  ])
}

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'))
}

async function writeJson(file, content) {
  await writeFile(file, `${JSON.stringify(content, null, 2)}\n`)
}
