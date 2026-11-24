#!/usr/bin/env node
// Create a new deck from the template:  npm run new -- my-deck-name
import { cpSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const name = process.argv[2]

if (!name || !/^[a-z0-9][a-z0-9-]*$/i.test(name)) {
  console.error('Usage: npm run new -- <deck-name>   (letters, numbers, dashes)')
  process.exit(1)
}

const target = join(root, 'decks', name)
if (existsSync(target)) {
  console.error(`decks/${name} already exists`)
  process.exit(1)
}

cpSync(join(root, 'template'), target, {
  recursive: true,
  filter: src => !src.includes('node_modules') && !src.includes('.slidev'),
})

// The template points at ../theme; a deck in decks/<name>/ is one level deeper.
const slides = join(target, 'slides.md')
writeFileSync(slides, readFileSync(slides, 'utf8').replace('theme: ../theme', 'theme: ../../theme'))

console.log(`Created decks/${name}/slides.md`)
console.log(`Run it:    npx slidev decks/${name}/slides.md --open`)
console.log(`Export:    npx slidev export decks/${name}/slides.md`)
