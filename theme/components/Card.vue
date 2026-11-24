<script setup lang="ts">
/**
 * Coloured card, like the agenda tiles and the timeline/valuation boxes.
 *
 *   <Card color="purple" eyebrow="Step 1" title="Browsing and login">
 *     Customers browse products and log in on the new system.
 *   </Card>
 *
 * color:   purple | amber | blue | gray
 * solid:   true for a filled tile (agenda style), false for a soft tint
 */
withDefaults(defineProps<{
  color?: 'purple' | 'amber' | 'blue' | 'gray'
  solid?: boolean
  eyebrow?: string
  title?: string
}>(), {
  color: 'purple',
  solid: false,
})
</script>

<template>
  <div class="aio-card" :class="[`is-${color}`, solid ? 'is-solid' : 'is-tint']">
    <div v-if="eyebrow" class="aio-card-eyebrow">{{ eyebrow }}</div>
    <div v-if="title" class="aio-card-title">{{ title }}</div>
    <div class="aio-card-body"><slot /></div>
  </div>
</template>

<style scoped>
.aio-card {
  border-radius: 8px;
  padding: 0.9rem 1rem;
  font-size: 0.82rem;
  line-height: 1.45;
}
.aio-card-eyebrow {
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.3rem;
}
.aio-card-title {
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.25;
  margin-bottom: 0.35rem;
}
.aio-card-body :deep(p) { margin: 0.35rem 0; }
.aio-card-body :deep(p:first-child) { margin-top: 0; }
.aio-card-body :deep(ul) { margin: 0.25rem 0; }

/* tint */
.is-tint { color: var(--aio-ink); }
.is-tint.is-purple { background: var(--aio-purple-tint); }
.is-tint.is-amber  { background: var(--aio-amber-tint); }
.is-tint.is-blue   { background: var(--aio-blue-tint); }
.is-tint.is-gray   { background: var(--aio-surface); border: 1px solid var(--aio-line); }
.is-tint.is-purple .aio-card-eyebrow { color: var(--aio-purple); }
.is-tint.is-amber  .aio-card-eyebrow { color: var(--aio-amber-strong); }
.is-tint.is-blue   .aio-card-eyebrow { color: var(--aio-blue); }
.is-tint.is-gray   .aio-card-eyebrow { color: var(--aio-muted); }

/* solid */
.is-solid.is-purple { background: var(--aio-purple); color: #fff; }
.is-solid.is-amber  { background: var(--aio-amber); color: var(--aio-ink); }
.is-solid.is-blue   { background: var(--aio-blue); color: #fff; }
.is-solid.is-gray   { background: var(--aio-ink); color: #fff; }
.is-solid .aio-card-eyebrow { opacity: 0.85; }
.is-solid :deep(li::before) { background: currentColor; }
</style>
