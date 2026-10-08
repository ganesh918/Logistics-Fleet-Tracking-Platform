import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const srcRoot = path.resolve('src')

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    if (fs.statSync(full).isDirectory()) walk(full, acc)
    else if (/\.tsx?$/.test(name)) acc.push(full)
  }
  return acc
}

function fixImports(code) {
  return code
    .replace(/from ['"]([^'"]+)\.tsx['"]/g, "from '$1.jsx'")
    .replace(/from ['"]([^'"]+)\.ts['"]/g, "from '$1.js'")
    .replace(/import type \{([^}]+)\} from ['"][^'"]+['"];?\n/g, '')
    .replace(/import type [^;]+;\n/g, '')
}

const compilerOptions = {
  module: ts.ModuleKind.ESNext,
  target: ts.ScriptTarget.ES2022,
  jsx: ts.JsxEmit.ReactJSX,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  esModuleInterop: true,
}

const files = walk(srcRoot)
const outPaths = []

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8')
  const outFile = file.replace(/\.tsx$/, '.jsx').replace(/\.ts$/, '.js')
  const result = ts.transpileModule(source, { compilerOptions, fileName: file })
  let code = fixImports(result.outputText)
  if (file.endsWith('types/index.ts') && !code.includes('defaultFilters')) {
    code = `${code}\nexport const defaultFilters = {
  search: '',
  vehicleStatus: 'all',
  driverStatus: 'all',
  shipmentStatus: 'all',
  dateFrom: '',
  dateTo: '',
  location: '',
};\n`
  }
  fs.writeFileSync(outFile, code, 'utf8')
  outPaths.push({ file, outFile })
}

for (const { file } of outPaths) {
  fs.unlinkSync(file)
}

console.log(`Converted ${outPaths.length} files to React.js (.js/.jsx)`)
