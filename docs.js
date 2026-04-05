import { Project, Signature } from 'ts-morph'
import { readFileSync, writeFileSync } from 'fs'

const repo_link = 'https://github.com/dkaraush/glmaths/blob/main/src/'

const project = new Project({ tsConfigFilePath: 'tsconfig.json' })

const classes = project.getSourceFiles().map(file => file.getClasses().filter(c => c.getName().length > 0)).flat()
const types = classes.map(clazz => clazz.getName().toLowerCase())
const fmtType = (type, n) => {
  const name = type?.getText(n).toLowerCase()
  return name.split(' | ').map(t => {
    if (types.indexOf(t) >= 0)
      return `[${t}](#${t})`
    return t
  }).join(' | ')
}
const fmtParams = (params, n) => {
  return params?.map(p => 
    p.getName() + (p.isOptional() ? '?' : '') + ': ' + fmtType(p.getType(n), n)
  )?.join?.(', ') ?? ''
}
const parseAliases = file => {
  const lines = file.getFullText().split('\n')
  const startIndex = lines.findIndex(line => line.startsWith('// @aliases'))
  if (startIndex < 0) return Object.create(null)
  const endIndex = startIndex + lines.slice(startIndex).findIndex(line => line.trim().length <= 0)
  return lines.slice(startIndex + 1, endIndex)
    .map(line => [...line.split(' = ').map(s => s.split('.').pop()), line.indexOf('prototype') < 0])
    .reduce((r, [alias, original, isStatic], i) => (r[original] = [...(r[original] ?? []), [alias, startIndex + 1 + i + 1, isStatic]], r), Object.create(null))
}

const docs = 
  project.getSourceFiles().map((file, _, __, aliases = parseAliases(file)) =>
    file.getClasses()
      .filter(c => c.getName().length > 0)
      .map((clazz,_,__, name = clazz.getName().toLowerCase()) => 
`
### [${name}](${repo_link}${file.getBaseName()}#L${clazz.getStartLineNumber()})
${
  clazz.getMethods().map(m =>
    `- ${m.isStatic() ? '_static_ ' : ''}**[${m.getName()}](${repo_link}${file.getBaseName()}#L${m.getStartLineNumber()})**(${fmtParams(m.getParameters(), m)}): ${fmtType(m.getReturnType?.(), m)}` +
    (aliases?.[m.getName()] ?? []).map(([alias, lineNumber, isStatic]) =>
      `\n- ${isStatic ? '_static_ ' : ''}**[${alias}](${repo_link}${file.getBaseName()}#L${lineNumber})** → **[${m.getName()}](${repo_link}${file.getBaseName()}#L${m.getStartLineNumber()})**`
    ).join('')
  ).join('\n')
}

`
      )
  )
  .flat().join('\n')

console.log(docs)

const docsComment = `<!-- DOCS -->\n`

writeFileSync(
  'README.md', 
  readFileSync('README.md').toString()
    .split(docsComment)
    .map((s, i) => i == 1 ? docsComment + docs + docsComment : s)
    .join('')
)