<!--
  Content slide. The first `# Heading` gets the brand gradient.

  Frontmatter:
    eyebrow: WEBSITE BUILDER BUSINESS UNIT PLAN   small purple label above the title
    presenter: Indra                             top-right tag
    gradient: false                              plain dark title instead of gradient
    shapes: corner | true                        add the small brand shapes
    footer: false                                hide slide number + brand
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
  <div class="slidev-layout default" :class="{ 'aio-gradient-h1': fm?.gradient !== false }">
    <Shapes v-if="shapes" :variant="shapes" />
    <SlideChrome />
    <div class="aio-content h-full">
      <div v-if="fm?.eyebrow" class="aio-eyebrow">{{ fm.eyebrow }}</div>
      <slot />
    </div>
  </div>
</template>
