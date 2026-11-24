<script lang="ts">
// Shared by every slide's footer: which section the last shown slide was in,
// so the next slide's marker can glide from there.
const trackerState = { last: -1 }
</script>

<script setup lang="ts">
/**
 * Presenter tag (top-right), slide number (bottom-left) and brand
 * (bottom-right). Used by the theme layouts; you don't need to add it.
 *
 * Frontmatter per slide:
 *   presenter: Indra     -> shows "presenter: Indra"
 *   footer: false        -> hides the number + brand
 * Headmatter (first slide) for the whole deck:
 *   themeConfig:
 *     brand: appliance.io
 *     logo: /logo.svg     (optional image in your deck's public/ folder)
 *     presenter: Indra    (default presenter for every content slide)
 *     sections: Problem, Solution, Plan   (optional section tracker in the footer)
 *     topline: true       (thin brand-gradient line along the top of content slides)
 * Frontmatter per slide for the tracker:
 *   section: Solution    -> highlights that section
 */
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { onSlideEnter, useSlideContext } from '@slidev/client'

const props = withDefaults(defineProps<{
  footer?: boolean
}>(), {
  footer: true,
})

const { $frontmatter, $slidev, $page } = useSlideContext()

// `presenter: false` on a slide hides the deck-wide default
const presenter = computed(() => {
  const value = $frontmatter?.presenter ?? $slidev.themeConfigs?.presenter
  return value === false ? null : value
})
const showFooter = computed(() => props.footer && $frontmatter?.footer !== false)
const brand = computed(() => $slidev.themeConfigs?.brand ?? 'appliance.io')
const logo = computed(() => $slidev.themeConfigs?.logo)
const pageLabel = computed(() => String($page.value).padStart(2, '0'))

// Section tracker: shows where the talk is, e.g. Problem  Solution  Plan
const sections = computed<string[]>(() => {
  const value = $slidev.themeConfigs?.sections ?? []
  // accepts a list or a comma-separated string: "Problem, Solution, Plan"
  return Array.isArray(value) ? value : String(value).split(',').map(v => v.trim()).filter(Boolean)
})
const current = computed(() => sections.value.indexOf($frontmatter?.section))
const hasTracker = computed(() => sections.value.length > 0 && current.value >= 0)
const topline = computed(() => $slidev.themeConfigs?.topline && $frontmatter?.topline !== false)

// Sliding marker: one bar under the tracker, positioned on the current section.
// When a slide is entered it starts where the previous slide's marker was and
// glides to this slide's section.
const items = ref<HTMLElement[]>([])
const marker = reactive({ left: 0, width: 0, animate: false })

function measure(i: number) {
  const el = items.value[i]
  return el ? { left: el.offsetLeft, width: el.offsetWidth } : null
}
function placeAtCurrent() {
  const to = measure(current.value)
  if (to) Object.assign(marker, to)
}

onMounted(async () => {
  placeAtCurrent()
  await document.fonts?.ready // widths change once Figtree has loaded
  placeAtCurrent()
})

onSlideEnter(async () => {
  if (!hasTracker.value) return
  await nextTick()
  const to = measure(current.value)
  if (!to) return
  const from = trackerState.last >= 0 && trackerState.last !== current.value
    ? measure(trackerState.last)
    : null
  trackerState.last = current.value
  if (!from) {
    marker.animate = false
    Object.assign(marker, to)
    return
  }
  marker.animate = false
  Object.assign(marker, from)
  // two frames so the start position is painted before the glide begins
  requestAnimationFrame(() => requestAnimationFrame(() => {
    marker.animate = true
    Object.assign(marker, to)
  }))
})
</script>

<template>
  <div v-if="topline" class="aio-topline" />
  <div v-if="presenter" class="aio-presenter">presenter: {{ presenter }}</div>
  <footer v-if="showFooter" class="aio-footer" :class="{ 'has-tracker': hasTracker }">
    <nav v-if="hasTracker" class="aio-tracker" aria-label="Sections">
      <span
        v-for="(name, i) in sections"
        :key="name"
        :ref="el => { if (el) items[i] = el as HTMLElement }"
        :class="{ done: i < current, now: i === current }"
      >{{ name }}</span>
      <span
        class="aio-marker"
        :class="{ animate: marker.animate }"
        :style="{ left: `${marker.left}px`, width: `${marker.width}px` }"
        aria-hidden="true"
      />
    </nav>
    <span v-else class="aio-page">{{ pageLabel }}</span>
    <div class="aio-brand">
      <img v-if="logo" :src="logo" :alt="brand">
      <span v-else>{{ brand }}</span>
      <span v-if="hasTracker" class="aio-page">{{ pageLabel }}</span>
    </div>
  </footer>
</template>

<style scoped>
.aio-topline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: var(--aio-gradient);
  z-index: 2;
}
.aio-presenter {
  position: absolute;
  top: 1.1rem;
  right: 1.5rem;
  font-size: 0.78rem;
  color: var(--aio-blue);
  z-index: 2;
}
/* Footer band. With a section tracker it gets a divider line, and the
   current section's gradient marker sits on that line like a tab. */
.aio-footer {
  position: absolute;
  left: 3.5rem;
  right: 3.5rem;
  bottom: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.6rem;
  line-height: 1;
  z-index: 2;
}
.aio-footer.has-tracker {
  border-top: 1px solid var(--aio-line);
  padding-top: 0.7rem;
}
.aio-page { color: var(--aio-muted); letter-spacing: 0.05em; }
.aio-brand { display: flex; align-items: center; gap: 0.9rem; font-weight: 700; color: var(--aio-ink); }
.aio-brand .aio-page { font-weight: 400; }
.aio-brand img { height: 1rem; }

.aio-tracker { position: relative; display: flex; gap: 1.4rem; color: #b3b3b3; }
.aio-tracker span { position: relative; transition: color 0.3s ease; }
.aio-tracker span.done { color: var(--aio-muted); }
.aio-tracker span.now { color: var(--aio-ink); font-weight: 700; }
/* the current section's marker sits on the divider line and glides between sections */
.aio-tracker .aio-marker {
  position: absolute;
  top: calc(-0.7rem - 2px);
  height: 3px;
  border-radius: 3px;
  background: var(--aio-gradient);
}
.aio-tracker .aio-marker.animate {
  transition: left 0.55s cubic-bezier(0.65, 0, 0.35, 1), width 0.55s cubic-bezier(0.65, 0, 0.35, 1);
}
@media (prefers-reduced-motion: reduce) {
  .aio-tracker .aio-marker.animate { transition: none; }
}
</style>
