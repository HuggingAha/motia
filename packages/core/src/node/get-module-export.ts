import path from 'path'
import * as tsconfigPaths from 'tsconfig-paths'

const tsConfigPath = path.resolve(process.cwd(), 'tsconfig.json')
const result = tsconfigPaths.loadConfig(tsConfigPath)

if (result.resultType !== 'success') {
  throw Error('Failed to load tsconfig.json')
}

const { absoluteBaseUrl, paths } = result

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'commonjs', baseUrl: absoluteBaseUrl, paths },
})

export const getModuleExport = async (filePath: string, exportName: string) => {
  try {
    const resolvedFilePath = require.resolve(filePath)

    if (resolvedFilePath in require.cache) {
      delete require.cache[resolvedFilePath]
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const module = require(resolvedFilePath)

    return module[exportName]
  } catch (error) {
    console.error(`Failed to extract ${exportName} from`, error)
    return undefined
  }
}
