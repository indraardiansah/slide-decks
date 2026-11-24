<!--
  Agenda grid, like "Today's Agenda" in the Canva deck.
  Tiles cycle through purple, amber and blue (solid first row, tinted second).

    ---
    layout: agenda
    presenter: Jon
    items:
      - Company Pulse
      - Appliance.io Design System
      - title: Website Builder Business Unit Plan
        note: Engineering Lead
    ---

    # Today's Agenda

  Frontmatter: items (required), columns (default 3), presenter, gradient: false, footer: false
-->
<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import SlideChrome from '../components/SlideChrome.vue'

const { $frontmatter: fm } = useSlideContext()

const palette = [
  'is-purple is-solid', 'is-amber is-solid', 'is-blue is-solid',
  'is-purple is-tint', 'is-amber is-tint', 'is-blue is-tint',
]

const items = computed(() =>
  (fm?.items ?? []).map((item: string | { title: string, note?: string }, i: number) => ({
    number: String(i + 1).padStart(2, '0'),
    title: typeof item === 'string' ? item : item.title,
    note: typeof item === 'string' ? undefined : item.note,
    tone: palette[i % palette.length],
  })),
)
const columns = computed(() => Number(fm?.columns ?? 3))
</script>

<template>
  <div class="slidev-layout agenda" :class="{ 'aio-gradient-h1': fm?.gradient !== false }">
    <SlideChrome />
    <div class="aio-content h-full flex flex-col">
      <div v-if="fm?.eyebrow" class="aio-eyebrow">{{ fm.eyebrow }}</div>
      <slot />
      <div
        class="aio-agenda-grid"
        :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }"
      >
        <div v-for="item in items" :key="item.number" class="aio-agenda-item" :class="item.tone">
          <div class="num">{{ item.number }}</div>
          <div class="title">{{ item.title }}</div>
          <div v-if="item.note" class="note">{{ item.note }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.aio-agenda-grid {
  display: grid;
  gap: 1.4rem 1.5rem;
  margin: auto 0;
  padding-bottom: 1rem;
}
.aio-agenda-item {
  border-radius: 6px;
  padding: 0.9rem 1.1rem 1.1rem;
  min-height: 6.2rem;
}
.num { font-size: 0.6rem; font-weight: 700; margin-bottom: 0.9rem; }
.title { font-size: 0.95rem; font-weight: 700; line-height: 1.3; }
.note { font-size: 0.75rem; margin-top: 0.3rem; opacity: 0.8; }

.is-solid.is-purple { background: var(--aio-purple); color: #fff; }
.is-solid.is-amber  { background: var(--aio-amber); color: var(--aio-ink); }
.is-solid.is-blue   { background: var(--aio-blue); color: #fff; }
.is-tint            { color: var(--aio-ink); }
.is-tint.is-purple  { background: var(--aio-purple-tint); }
.is-tint.is-amber   { background: var(--aio-amber-tint); }
.is-tint.is-blue    { background: var(--aio-blue-tint); }
</style>
