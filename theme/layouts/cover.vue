<!--
  Title slide: purple swoosh, amber arc and blue dot.

  Frontmatter:
    date: November, 2026     small text bottom-left
    gradient: true           gradient title (default: dark, like the Canva cover)
-->
<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import Shapes from '../components/Shapes.vue'

const { $frontmatter: fm } = useSlideContext()
</script>

<template>
  <div class="slidev-layout cover" :class="{ 'aio-gradient-h1': fm?.gradient === true }">
    <Shapes variant="cover" />
    <div class="aio-content h-full flex flex-col justify-center max-w-[62%]">
      <slot />
    </div>
    <div v-if="fm?.date" class="aio-cover-date">{{ fm.date }}</div>
  </div>
</template>

<style scoped>
.aio-cover-date {
  position: absolute;
  left: 3.5rem;
  bottom: 1.6rem;
  font-size: 0.75rem;
  color: var(--aio-ink);
  z-index: 1;
}
</style>
