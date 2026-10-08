import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const transcript = fs.readFileSync(
  path.resolve(
    process.env.USERPROFILE ?? '',
    '.cursor/projects/c-Users-GaneshReddy-Desktop-logistics-and-fleet-tracking/agent-transcripts/2fdeb2b5-fa53-4d38-b6ce-d2a330c043f6/2fdeb2b5-fa53-4d38-b6ce-d2a330c043f6.jsonl',
  ),
  'utf8',
)

const projectRoot = path.resolve('.')
const restored = new Map()

for (const line of transcript.split('\n')) {
  if (!line.trim()) continue
  let row
  try {
    row = JSON.parse(line)
  } catch {
    continue
  }
  const content = row?.message?.content
  if (!Array.isArray(content)) continue
  for (const part of content) {
    if (part?.type !== 'tool_use' || part?.name !== 'Write') continue
    const filePath = part.input?.path?.replace(/\\/g, '/')
    if (!filePath?.includes('/src/') || !/\.tsx?$/.test(filePath)) continue
    const rel = path.relative(projectRoot, filePath.replace(/\//g, path.sep))
    if (!rel.startsWith('src')) continue
    restored.set(rel, part.input.contents)
  }
}

if (restored.size === 0) {
  console.error('No source files found in transcript')
  process.exit(1)
}

function stripTypes(source) {
  const result = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.Preserve,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
    },
    fileName: 'file.tsx',
  })
  return result.outputText
    .replace(/^import type .*;\n/gm, '')
    .replace(/import \{([^}]*), type ([^}]*)\} from/g, 'import {$1} from')
    .replace(/, type /g, ', ')
    .replace(/import type \{[^}]+\} from ['"][^'"]+['"];?\n/g, '')
}

for (const [rel, contents] of restored) {
  const out = rel.replace(/\.tsx$/, '.jsx').replace(/\.ts$/, '.js')
  const code = stripTypes(contents)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, code, 'utf8')
}

console.log(`Restored ${restored.size} React.js files with JSX syntax`)
