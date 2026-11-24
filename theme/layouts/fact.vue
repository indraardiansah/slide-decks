<!--
  One big number or statement, in the brand gradient.

    # $6.86M
    processed in August

  Frontmatter: eyebrow, presenter, gradient: false, shapes, footer: false
-->
<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import Shapes from '../components/Shapes.vue'
import SlideChrome from '../components/SlideChrome.vue'

const { $frontmatter: fm } = useSlideContext()
const shapes = computed(() => (fm?.shapes === true ? 'corner' : fm?.shapes))
</script>

<template>
  <div class="slidev-layout fact" :class="{ 'aio-gradient-h1': fm?.gradient !== false }">
    <Shapes v-if="shapes" :variant="shapes" />
    <SlideChrome />
    <div class="aio-content h-full flex flex-col items-center justify-center text-center">
      <div v-if="fm?.eyebrow" class="aio-eyebrow">{{ fm.eyebrow }}</div>
      <slot />
    </div>
  </div>
</template>
