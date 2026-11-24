<!--
  Section divider: centred title with the brand shapes.

  Frontmatter:
    shapes: mirror          flip the shapes (default: section)
    gradient: true          gradient title (default: dark, like the Canva dividers)
-->
<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import Shapes from '../components/Shapes.vue'

const { $frontmatter: fm } = useSlideContext()
</script>

<template>
  <div class="slidev-layout section" :class="{ 'aio-gradient-h1': fm?.gradient === true }">
    <Shapes :variant="fm?.shapes === 'mirror' ? 'mirror' : 'section'" />
    <div class="aio-content h-full flex flex-col items-center justify-center text-center">
      <slot />
    </div>
  </div>
</template>
