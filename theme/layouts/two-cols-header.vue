<!--
  Title across the top, two columns below, optional bottom strip.

    # The title
    Optional subtitle
    ::left::
    Left column
    ::right::
    Right column
    ::bottom::
    Optional takeaway bar

  Frontmatter: eyebrow, presenter, gradient: false, shapes, footer: false
-->
<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import Shapes from '../components/Shapes.vue'
import SlideChrome from '../components/SlideChrome.vue'

const props = defineProps({
  class: { type: String },
  layoutClass: { type: String },
})

const { $frontmatter: fm } = useSlideContext()
const shapes = computed(() => (fm?.shapes === true ? 'corner' : fm?.shapes))
</script>

<template>
  <div
    class="slidev-layout two-cols-header"
    :class="[layoutClass, { 'aio-gradient-h1': fm?.gradient !== false }]"
  >
    <Shapes v-if="shapes" :variant="shapes" />
    <SlideChrome />
    <div class="aio-content aio-grid h-full">
      <div class="col-header">
        <div v-if="fm?.eyebrow" class="aio-eyebrow">{{ fm.eyebrow }}</div>
        <slot />
      </div>
      <div class="col-left" :class="props.class"><slot name="left" /></div>
      <div class="col-right" :class="props.class"><slot name="right" /></div>
      <div v-if="$slots.bottom" class="col-bottom" :class="props.class"><slot name="bottom" /></div>
    </div>
  </div>
</template>

<style scoped>
.aio-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto 1fr auto;
  column-gap: 1.5rem;
  row-gap: 1rem;
}
.col-header { grid-area: 1 / 1 / 2 / 3; }
.col-left { grid-area: 2 / 1 / 3 / 2; }
.col-right { grid-area: 2 / 2 / 3 / 3; }
.col-bottom { grid-area: 3 / 1 / 4 / 3; align-self: end; }
</style>
