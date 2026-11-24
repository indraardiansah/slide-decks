<!--
  Closing slide. Uses "Thank You!" when the slide has no content.

  Frontmatter:
    gradient: false         plain dark text instead of the gradient
-->
<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import Shapes from '../components/Shapes.vue'

const { $frontmatter: fm, $slidev } = useSlideContext()
const brand = computed(() => $slidev.themeConfigs?.brand ?? 'appliance.io')
const logo = computed(() => $slidev.themeConfigs?.logo)
</script>

<template>
  <div class="slidev-layout end" :class="{ 'aio-gradient-h1': fm?.gradient !== false }">
    <Shapes variant="end" />
    <div class="aio-end-brand">
      <img v-if="logo" :src="logo" :alt="brand">
      <span v-else>{{ brand }}</span>
    </div>
    <div class="aio-content h-full flex flex-col items-end justify-end text-right">
      <slot>
        <h1>Thank<br>You!</h1>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.aio-end-brand {
  position: absolute;
  top: 1.4rem;
  left: 1.6rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--aio-ink);
  z-index: 1;
}
.aio-end-brand img { height: 1.4rem; }
.end :deep(h1) { margin: 0 0 -0.4rem auto; }
</style>
