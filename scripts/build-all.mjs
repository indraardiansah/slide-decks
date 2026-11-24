#!/usr/bin/env node
// Build every deck in decks/ into dist/<deck>/ plus an index page at dist/index.html.
//   npm run build:all                       -> served from /
//   BASE_PATH=/slide-decks/ npm run build:all  -> served from GitHub Pages project URL
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const base = (process.env.BASE_PATH || '/').replace(/\/?$/, '/')
const dist = join(root, 'dist')
const only = process.argv.slice(2)

rmSync(dist, { recursive: true, force: true })
mkdirSync(dist, { recursive: true })

const decks = readdirSync(join(root, 'decks'), { withFileTypes: true })
  .filter(d => d.isDirectory() && existsSync(join(root, 'decks', d.name, 'slides.md')))
  .map(d => d.name)
  .filter(name => only.length === 0 || only.includes(name))
  .sort()

const entries = []
for (const name of decks) {
  const entry = join(root, 'decks', name, 'slides.md')
  const front = readFileSync(entry, 'utf8').split(/^---$/m)[1] || ''
  const field = key => (front.match(new RegExp(`^${key}:\\s*(.+)$`, 'm')) || [])[1]?.trim().replace(/^['"]|['"]$/g, '')
  if (field('hidden') === 'true') continue

  console.log(`\n▶ Building ${name}`)
  execFileSync('npx', ['slidev', 'build', entry, '--base', `${base}${name}/`, '--out', join(dist, name)], {
    cwd: root,
    stdio: 'inherit',
  })
  entries.push({ name, title: field('title') || name, date: field('date') || '' })
}

const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
writeFileSync(join(dist, 'index.html'), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Slide decks</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;600;800&display=swap" rel="stylesheet">
<style>
  body { margin: 0; font-family: Figtree, system-ui, sans-serif; color: #3A3A3A; background: #fff; }
  main { max-width: 760px; margin: 0 auto; padding: 64px 16px; }
  h1 { font-size: 40px; font-weight: 800; margin: 0 0 32px;
       background: linear-gradient(90deg, #B645BF, #C96592, #E7974C, #FCB91B);
       -webkit-background-clip: text; background-clip: text; color: transparent; }
  ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
  a { display: block; padding: 20px 24px; border: 1px solid #eee; border-radius: 12px;
      text-decoration: none; color: inherit; transition: border-color .15s; }
  a:hover { border-color: #B645BF; }
  .t { font-size: 20px; font-weight: 600; }
  .d { color: #6B6B6B; font-size: 14px; margin-top: 4px; }
</style>
</head>
<body>
<main>
  <h1>Slide decks</h1>
  <ul>
${entries.map(e => `    <li><a href="${base}${e.name}/"><div class="t">${esc(e.title.replace(/<br\s*\/?>/gi, ' '))}</div><div class="d">${esc(e.date)}</div></a></li>`).join('\n')}
  </ul>
</main>
</body>
</html>
`)
writeFileSync(join(dist, '.nojekyll'), '')
console.log(`\n✓ Built ${entries.length} deck(s) into dist/ (base ${base})`)
