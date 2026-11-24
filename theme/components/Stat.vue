<script setup lang="ts">
/**
 * Big number with a label and an optional change, like
 * "36 active clients · +5.6%" or "$4.0M · Formal third-party valuation".
 *
 *   <Stat value="$4.0M" label="August 2026 valuation" note="Formal third-party valuation" />
 *   <Stat value="327" label="Active users" delta="-0.3%" color="amber" />
 *
 * gradient: render the value in the brand gradient instead of a flat colour
 */
const props = withDefaults(defineProps<{
  value: string | number
  label?: string
  note?: string
  delta?: string
  color?: 'purple' | 'amber' | 'blue' | 'ink'
  gradient?: boolean
}>(), {
  color: 'ink',
  gradient: false,
})

const trend = (() => {
  const d = String(props.delta ?? '').trim()
  if (d.startsWith('+')) return 'up'
  if (d.startsWith('-') || d.startsWith('−')) return 'down'
  return 'flat'
})()
</script>

<template>
  <div class="aio-stat" :class="`is-${color}`">
    <div v-if="label" class="aio-stat-label">{{ label }}</div>
    <div class="aio-stat-value" :class="{ 'text-gradient': gradient }">{{ value }}</div>
    <div v-if="delta" class="aio-stat-delta" :class="`is-${trend}`">{{ delta }}</div>
    <div v-if="note || $slots.default" class="aio-stat-note">
      <slot>{{ note }}</slot>
    </div>
  </div>
</template>

<style scoped>
.aio-stat-label {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--aio-muted);
  margin-bottom: 0.25rem;
}
.is-purple .aio-stat-label { color: var(--aio-purple); }
.is-amber  .aio-stat-label { color: var(--aio-amber-strong); }
.is-blue   .aio-stat-label { color: var(--aio-blue); }

.aio-stat-value {
  font-size: 3.2rem;
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--aio-ink);
  width: fit-content;
}
.is-purple .aio-stat-value:not(.text-gradient) { color: var(--aio-purple); }
.is-amber  .aio-stat-value:not(.text-gradient) { color: var(--aio-amber-strong); }
.is-blue   .aio-stat-value:not(.text-gradient) { color: var(--aio-blue); }

.aio-stat-delta {
  font-weight: 700;
  font-size: 0.95rem;
  margin-top: 0.2rem;
}
.aio-stat-delta.is-up   { color: #1f9d55; }
.aio-stat-delta.is-down { color: #d64545; }
.aio-stat-delta.is-flat { color: var(--aio-muted); }

.aio-stat-note {
  font-size: 0.82rem;
  color: var(--aio-muted);
  margin-top: 0.35rem;
}
</style>
