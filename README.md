# Presentations (Slidev + Appliance.io theme)

A reusable [Slidev](https://sli.dev) theme matched to the "November All Hands" Canva deck: brand colours, gradient titles, the purple swoosh / amber ring / blue dot shapes, and Figtree as the font.

```
slide-decks/
├── theme/              # the theme (layouts, components, styles)
├── template/slides.md  # starter deck that shows every layout
├── .github/workflows/  # builds every deck and publishes to GitHub Pages
├── decks/              # your presentations, one folder each
└── scripts/new-deck.mjs
```

## Quick start

```bash
npm install                               # first time only

npm run new -- november-all-hands         # copies the template to decks/november-all-hands/
npx slidev decks/november-all-hands/slides.md --open
```

Export to PDF or PNG:

```bash
npx slidev export decks/november-all-hands/slides.md                       # PDF
npx slidev export decks/november-all-hands/slides.md --format png          # one PNG per slide
npx slidev export decks/november-all-hands/slides.md --format pptx         # PowerPoint (slides as images)
```

To preview the template itself: `npx slidev template/slides.md --open`.

## Publishing (GitHub Pages)

Every push to `main` builds all decks in `decks/` and publishes them to the `gh-pages` branch, which GitHub Pages serves:

- Index of all decks: https://indraardiansah.github.io/slide-decks/
- One deck: `https://indraardiansah.github.io/slide-decks/<deck-name>/` (slide 5: `…/<deck-name>/#/5`)

Decks stay interactive (buttons, simulations, animations). Deploys take 1–2 minutes; watch them under the repo's Actions tab. To leave a deck off the site, add `hidden: true` to its first slide's frontmatter.

Build the site locally, the same way CI does:

```bash
BASE_PATH=/slide-decks/ npm run build:all     # all decks into dist/
npm run build:all -- api-separation-proposal  # just one deck
```

Requires Node 22+.

## Deck settings (first slide)

```yaml
---
theme: ../../theme
title: My Presentation
layout: cover
date: November, 2026
themeConfig:
  brand: appliance.io     # bottom-right text on content slides
  logo: /logo.svg         # optional: an image in decks/<name>/public/ replaces the brand text
  presenter: Indra        # optional: default presenter tag on every content slide
  sections: Problem, Solution, Plan   # optional: section tracker in the footer
  topline: true          # optional: thin brand-gradient line on top of content slides
---
```

## Layouts

| Layout | Use for | Canva equivalent |
| --- | --- | --- |
| `cover` | Title slide. `date:` shows bottom-left. | Slide 1 |
| `agenda` | Numbered coloured tiles from `items:` | "Today's Agenda" |
| `section` | Section divider. `shapes: mirror` flips the shapes. | "Company Pulse", "QnA Session" |
| `default` | Normal content slide. Title in gradient. | "Company Growth Recap" |
| `two-cols-header` | Title on top, `::left::` / `::right::` / `::bottom::` | "Company Valuation" |
| `center` | Centred content | |
| `fact` | One big number in gradient | "$6.86M processed" |
| `end` | Closing slide. Shows "Thank You!" if left empty. | "Thank You!" |

Other built-in Slidev layouts (`image-right`, `quote`, `iframe` …) still work and pick up the theme fonts and colours.

### Per-slide frontmatter

| Key | Layouts | What it does |
| --- | --- | --- |
| `presenter: Jon` | content layouts | Blue "presenter: Jon" tag top-right. `presenter: false` hides the deck default. |
| `eyebrow: TEXT` | content layouts | Small purple uppercase label above the title |
| `gradient: false` | content layouts, `end` | Dark title instead of the gradient |
| `gradient: true` | `cover`, `section` | Gradient title (these are dark by default, like the Canva) |
| `shapes: header` | content layouts | The cover's swoosh, dot and arc, scaled down into the top-right corner. Also accepts `corner` (bottom-right), `cover`, `section`, `mirror`, `end`. |
| `section: Plan` | content layouts | Highlights that section in the footer tracker (needs `themeConfig.sections`). |
| `footer: false` | content layouts | Hides the slide number and brand |

## Components

```html
<!-- Gradient text -->
<GradientText>Company Growth Recap</GradientText>
<GradientText as="h2" variant="cool">Platform Security</GradientText>   <!-- warm | cool | full -->
<span class="text-gradient">inline text</span>

<!-- Coloured card: purple | amber | blue | gray, tint (default) or solid -->
<Card color="purple" eyebrow="Step 1" title="Browsing and login">
  Customers browse products and log in on the new system.
</Card>
<Card color="blue" solid title="Appliance.io Platform Security" />

<!-- Big number -->
<Stat value="36" label="Active clients" delta="+5.6%" note="Aug–Oct 2026" color="purple" />
<Stat value="$4.0M" label="Valuation" gradient />

<!-- Brand shapes, if you build a custom slide with layout: none -->
<Shapes variant="cover" />
```

Lay cards out with UnoCSS grid classes: `<div class="grid grid-cols-3 gap-4">…</div>`.

## Colours

Sampled from the Canva deck. Use them as UnoCSS classes (`text-aio-purple`, `bg-aio-amber-tint`, `border-aio-blue`) or CSS variables (`var(--aio-purple)`).

| Name | Hex | Tint |
| --- | --- | --- |
| purple | `#B645BF` | `purple-tint` `#F5E8F7` |
| amber | `#FFBE15` (text: `amber-strong` `#C58A00`) | `amber-tint` `#FFF4CC` |
| blue | `#4D6EF5` | `blue-tint` `#E6ECFE` |
| ink (text) | `#3A3A3A` | `muted` `#6B6B6B` |

Title gradient: `#B645BF → #C96592 → #E7974C → #FCB91B` (`var(--aio-gradient)`).

## Changing the theme

- Colours and gradients: [theme/styles/base.css](theme/styles/base.css) (`:root` variables) and [theme/uno.config.ts](theme/uno.config.ts)
- Fonts: `slidev.defaults.fonts` in [theme/package.json](theme/package.json)
- Shapes: [theme/components/Shapes.vue](theme/components/Shapes.vue) (SVG on a 1920×1080 grid)
